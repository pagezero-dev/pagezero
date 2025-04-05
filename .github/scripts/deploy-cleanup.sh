#! /bin/bash

echo "Fetching Cloudflare deployment IDs for branch: $PR_BRANCH"
RESPONSE=$(curl -s -X GET "https://api.cloudflare.com/client/v4/accounts/$CLOUDFLARE_ACCOUNT_ID/pages/projects/$CLOUDFLARE_PROJECT_NAME/deployments" \
  -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
  -H "Content-Type: application/json")

CLOUDFLARE_DEPLOYMENT_IDS=$(echo "$RESPONSE" | jq -r --arg branch "$PR_BRANCH" \
  '.result[] | select(.deployment_trigger.metadata.branch == $branch) | .id')

if [ -z "$CLOUDFLARE_DEPLOYMENT_IDS" ]; then
  echo "No Cloudflare deployments found for this branch."
else
  echo "Found Cloudflare Deployment IDs: $CLOUDFLARE_DEPLOYMENT_IDS"
  for CLOUDFLARE_DEPLOYMENT_ID in $CLOUDFLARE_DEPLOYMENT_IDS; do
    echo "Deleting Cloudflare Pages deployment: $CLOUDFLARE_DEPLOYMENT_ID"
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


echo "Fetching GitHub deployment IDs for branch: $PR_BRANCH"
RESPONSE=$(curl -s -H "Authorization: token $GITHUB_TOKEN" \
  "https://api.github.com/repos/$GITHUB_REPOSITORY/deployments")

GITHUB_DEPLOYMENT_IDS=$(echo "$RESPONSE" | jq -r --arg branch "$PR_BRANCH" \
  '.[] | select(.ref == $branch) | .id')

if [ -z "$GITHUB_DEPLOYMENT_IDS" ]; then
  echo "No GitHub deployments found for this branch."
else
  echo "Found GitHub Deployment IDs: $GITHUB_DEPLOYMENT_IDS"
  for GITHUB_DEPLOYMENT_ID in $GITHUB_DEPLOYMENT_IDS; do
    echo "Deleting GitHub deployment: $GITHUB_DEPLOYMENT_ID"
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
