#! /bin/bash

echo "⏳ Fetching Cloudflare deployment IDs for branch: $PR_BRANCH..."
RESPONSE=$(curl -s -X GET "https://api.cloudflare.com/client/v4/accounts/$CLOUDFLARE_ACCOUNT_ID/pages/projects/$CLOUDFLARE_PROJECT_NAME/deployments" \
  -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
  -H "Content-Type: application/json")

CLOUDFLARE_DEPLOYMENT_IDS=$(echo "$RESPONSE" | jq -r --arg branch "$PR_BRANCH" \
  '.result[] | select(.deployment_trigger.metadata.branch == $branch) | .id')

if [ -z "$CLOUDFLARE_DEPLOYMENT_IDS" ]; then
  echo "No Cloudflare deployments found for this branch."
else
  echo "ℹ️ Found Cloudflare Deployment IDs:"
  echo $CLOUDFLARE_DEPLOYMENT_IDS
  echo "⏳ Deleting Cloudflare Pages deployments..."

  for CLOUDFLARE_DEPLOYMENT_ID in $CLOUDFLARE_DEPLOYMENT_IDS; do
    curl -X DELETE "https://api.cloudflare.com/client/v4/accounts/$CLOUDFLARE_ACCOUNT_ID/pages/projects/$CLOUDFLARE_PROJECT_NAME/deployments/$CLOUDFLARE_DEPLOYMENT_ID?force=true" \
      -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
      -H "Content-Type: application/json" \
      -o response.json

    if grep -q '"success": true' response.json; then
      echo "✅ Successfully deleted Cloudflare deployment $CLOUDFLARE_DEPLOYMENT_ID."
    else
      echo "❌ Failed to delete Cloudflare deployment $CLOUDFLARE_DEPLOYMENT_ID."
      cat response.json
      exit 1
    fi
  done
fi


echo "⏳ Fetching GitHub deployment IDs for branch: $PR_BRANCH..."
RESPONSE=$(curl -s -H "Authorization: token $GITHUB_TOKEN" \
  "https://api.github.com/repos/$GITHUB_REPOSITORY/deployments")

GITHUB_DEPLOYMENT_IDS=$(echo "$RESPONSE" | jq -r --arg branch "$PR_BRANCH" \
  '.[] | select(.ref == $branch) | .id')

if [ -z "$GITHUB_DEPLOYMENT_IDS" ]; then
  echo "No GitHub deployments found for this branch."
else
  echo "ℹ️ Found GitHub Deployment IDs:"
  echo $GITHUB_DEPLOYMENT_IDS
  echo "⏳ Deactivating GitHub deployments..."

  for GITHUB_DEPLOYMENT_ID in $GITHUB_DEPLOYMENT_IDS; do
    HTTP_STATUS=$(curl -s -o response.json -w "%{http_code}" -X POST \
      -H "Authorization: token $GITHUB_TOKEN" \
      -H "Accept: application/vnd.github.v3+json" \
      -d '{"state": "inactive"}' \
      "https://api.github.com/repos/$GITHUB_REPOSITORY/deployments/$GITHUB_DEPLOYMENT_ID/statuses")

    if [ "$HTTP_STATUS" -eq 201 ]; then
      echo "✅ Successfully deactivated GitHub deployment $GITHUB_DEPLOYMENT_ID."
    else
      echo "❌ Failed to deactivate GitHub deployment $GITHUB_DEPLOYMENT_ID. HTTP status: $HTTP_STATUS"
      cat response.json
      exit 1
    fi
  done

  echo "⏳ Deleting GitHub deployments..."

  for GITHUB_DEPLOYMENT_ID in $GITHUB_DEPLOYMENT_IDS; do
    HTTP_STATUS=$(curl -s -o response.json -w "%{http_code}" \
      -X DELETE "https://api.github.com/repos/$GITHUB_REPOSITORY/deployments/$GITHUB_DEPLOYMENT_ID" \
      -H "Authorization: token $GITHUB_TOKEN" \
      -H "Accept: application/vnd.github.v3+json")

    if [[ "$HTTP_STATUS" -eq 204 ]]; then
      echo "✅ Successfully deleted GitHub deployment $GITHUB_DEPLOYMENT_ID."
    else
      echo "❌ Unexpected error (HTTP $HTTP_STATUS) while deleting deployment $GITHUB_DEPLOYMENT_ID."
      cat response.json
      exit 1
    fi
  done
fi
