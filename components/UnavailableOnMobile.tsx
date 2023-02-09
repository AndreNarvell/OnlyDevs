import { ButtonLink } from "./Button"
import { Text } from "./Text"
import { ChevronLeftIcon } from "@heroicons/react/24/outline"

export const UnavailableOnMobile = () => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4 lg:hidden gap-y-4 bg-accents-1">
      <Text as="h1" align="center" className="px-8">
        This shit doesn&apos;t work on mobile, but our apps do!
      </Text>

      <div className="flex flex-col items-center gap-y-0">
        <a href="https://play.google.com/store/apps/details?id=com.king.candycrushsaga&hl=en&gl=US&pcampaignid=pcampaignidMKT-Other-global-all-co-prtnr-py-PartBadge-Mar2515-1">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="h-16"
            alt="Get it on Google Play"
            src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png"
          />
        </a>

        <a
          href="https://apps.apple.com/us/app/candy-crush-saga/id553834731?itsct=apps_box_badge&itscg=30200"
          style={{
            display: "inline-block",
            overflow: "hidden",
            borderRadius: 13,
            width: 250,
            height: 83,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="h-12"
            src="https://tools.applemediaservices.com/api/badges/download-on-the-app-store/black/en-us?size=250x83&releaseDate=1352851200"
            alt="Download on the App Store"
            style={{ borderRadius: 13, width: 250 }}
          />
        </a>
      </div>

      <ButtonLink href="/dashboard" intent="secondary" variant="ghost">
        <ChevronLeftIcon className="w-6 h-6" /> Back to dashboard
      </ButtonLink>
    </div>
  )
}
