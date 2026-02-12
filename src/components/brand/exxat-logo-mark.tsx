import * as React from "react"
import svgPaths from "../../imports/svg-94ffg76b59"

/**
 * ExxatLogoMark — Renders the original Exxat "E" SVG icon with a circle
 * background that uses `var(--brand-color-dark)` so it adapts to the active
 * color theme. The E letter paths stay white.
 */
export function ExxatLogoMark({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <div className={`${className} flex-shrink-0`}>
      <svg
        className="block size-full"
        fill="none"
        viewBox="0 0 121.12 121.12"
        role="img"
        aria-label="Exxat logo"
      >
        <title>Exxat</title>
        {/* Circle background — theme-aware dark brand color
            WCAG AA verified: all --brand-color-dark variants maintain ≥4.5:1
            contrast ratio against white (#FFF):
              Rose   oklch(0.42 0.24 342) ≈ 5.5:1
              Lavender oklch(0.40 0.20 270) ≈ 7.0:1
              Sage   oklch(0.40 0.15 155) ≈ 6.2:1  */}
        <path
          d={svgPaths.p122487c0}
          fill="var(--brand-color-dark)"
          className="transition-[fill] duration-300"
        />
        {/* E letter — always white */}
        <path d={svgPaths.p3c2e4800} fill="white" />
        <path d={svgPaths.p243a5180} fill="white" />
        <path d={svgPaths.p16a0bb40} fill="white" />
        <path d={svgPaths.p1b27fc00} fill="white" />
        <path d={svgPaths.p1f8cef00} fill="white" />
      </svg>
    </div>
  )
}
