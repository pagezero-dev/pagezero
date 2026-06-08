import { render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import type { PaymentsConfig } from "@/payments/types"
import type { UserData } from "@/user/get-user"
import { useUser } from "@/user/use-user"
import { CheckoutButton } from "./checkout-button"

vi.mock("@/user/use-user")

vi.mock("@/config", () => ({
  default: {
    payments: {
      products: {
        elite: {
          name: "Elite",
          userRoleToGrant: "elite",
          polarProductId: {
            preview: "elite-preview-product-id",
            production: "elite-production-product-id",
          },
          checkoutLink: {
            preview:
              "https://sandbox-api.polar.sh/v1/checkout-links/elite-preview-product-id/redirect",
            production:
              "https://sandbox-api.polar.sh/v1/checkout-links/elite-production-product-id/redirect",
          },
        },
      },
    },
  } satisfies PaymentsConfig,
}))

describe("<CheckoutButton />", async () => {
  it("renders with checkout link when user is not authenticated", async () => {
    vi.mocked(useUser).mockReturnValue({
      data: { user: null } satisfies UserData,
      error: null,
      isLoading: false,
      isPending: false,
      isError: false,
      isSuccess: true,
      status: "success",
      fetchStatus: "idle",
      isFetching: false,
      isRefetching: false,
      isLoadingError: false,
      isRefetchError: false,
      isPlaceholderData: false,
      isStale: false,
      isPaused: false,
      isEnabled: true,
      promise: Promise.resolve({ user: null }),
      refetch: vi.fn(),
    } as unknown as ReturnType<typeof useUser>)

    render(<CheckoutButton productId="elite">Get Elite</CheckoutButton>)
    const link = screen.getByRole("link", { name: "Get Elite" })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute(
      "href",
      "https://sandbox-api.polar.sh/v1/checkout-links/elite-preview-product-id/redirect",
    )
  })

  it("renders with checkout link and customer email when user is authenticated", async () => {
    vi.mocked(useUser).mockReturnValue({
      data: { user: { id: 1, email: "test@example.com" } } satisfies UserData,
      error: null,
      isLoading: false,
      isPending: false,
      isError: false,
      isSuccess: true,
      status: "success",
      fetchStatus: "idle",
      isFetching: false,
      isRefetching: false,
      isLoadingError: false,
      isRefetchError: false,
      isPlaceholderData: false,
      isStale: false,
      isPaused: false,
      isEnabled: true,
      promise: Promise.resolve({
        user: { id: 1, email: "test@example.com" },
      }),
      refetch: vi.fn(),
    } as unknown as ReturnType<typeof useUser>)

    render(<CheckoutButton productId="elite">Get Elite</CheckoutButton>)
    const link = screen.getByRole("link", { name: "Get Elite" })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute(
      "href",
      "https://sandbox-api.polar.sh/v1/checkout-links/elite-preview-product-id/redirect?customer_email=test%40example.com",
    )
  })
})
