"use client"

import * as React from "react"
import {
  BadgeCheck,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Sparkles,
  Moon,
  Sun,
  Monitor,
  Palette,
} from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "../ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "../ui/sidebar"

type ColorTheme = "rose" | "lavender" | "sage"

const COLOR_THEMES: { value: ColorTheme; label: string; swatch: string }[] = [
  { value: "rose",     label: "Rose",     swatch: "oklch(0.57 0.24 342)" },
  { value: "lavender", label: "Lavender", swatch: "oklch(0.55 0.20 270)" },
  { value: "sage",     label: "Sage",     swatch: "oklch(0.55 0.15 155)" },
]

export function NavUser({
  user,
  isCollapsed: isCollapsedProp,
}: {
  user: {
    name: string
    email: string
    avatar: string
  }
  isCollapsed?: boolean
}) {
  const { isMobile, state } = useSidebar()
  const isCollapsed = isCollapsedProp ?? state === "collapsed"
  const [theme, setTheme] = React.useState<"light" | "dark" | "system">("light")
  const [colorTheme, setColorTheme] = React.useState<ColorTheme>("rose")

  // Initialize themes from localStorage
  React.useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | "system" | null
    const savedColor = localStorage.getItem("colorTheme") as ColorTheme | null
    const initialTheme = savedTheme || "light"
    const initialColor = savedColor || "rose"
    
    setTheme(initialTheme)
    setColorTheme(initialColor)
    applyTheme(initialTheme)
    applyColorTheme(initialColor)
  }, [])

  // Apply light/dark theme to document
  const applyTheme = (newTheme: "light" | "dark" | "system") => {
    const root = document.documentElement
    
    if (newTheme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
      if (systemTheme === "dark") {
        root.classList.add("dark")
      } else {
        root.classList.remove("dark")
      }
    } else if (newTheme === "dark") {
      root.classList.add("dark")
    } else {
      root.classList.remove("dark")
    }
    
    localStorage.setItem("theme", newTheme)
  }

  // Apply color theme class to document
  const applyColorTheme = (newColor: ColorTheme) => {
    const root = document.documentElement
    // Remove all theme classes
    root.classList.remove("theme-lavender", "theme-sage")
    // Apply selected (rose is the default — no class needed)
    if (newColor !== "rose") {
      root.classList.add(`theme-${newColor}`)
    }
    localStorage.setItem("colorTheme", newColor)
  }

  // Handle light/dark change
  const handleThemeChange = (newTheme: "light" | "dark" | "system") => {
    setTheme(newTheme)
    applyTheme(newTheme)
  }

  // Handle color theme change
  const handleColorThemeChange = (newColor: string) => {
    const color = newColor as ColorTheme
    setColorTheme(color)
    applyColorTheme(color)
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className={`data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground ${isCollapsed ? "!p-0 justify-center" : ""}`}
            >
              <Avatar className={`h-8 w-8 rounded-lg ${isCollapsed ? "mx-auto" : ""}`}>
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-lg">SJ</AvatarFallback>
              </Avatar>
              {!isCollapsed && (
                <>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{user.name}</span>
                    <span className="truncate text-xs">{user.email}</span>
                  </div>
                  <ChevronsUpDown className="ml-auto size-4" />
                </>
              )}
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg z-[100]"
            side={isCollapsed ? "right" : "bottom"}
            align="start"
            sideOffset={isCollapsed ? 8 : 4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-lg">SJ</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{user.name}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <Sparkles className="h-4 w-4" />
                Upgrade to Pro
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <BadgeCheck className="h-4 w-4" />
                Account
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CreditCard className="h-4 w-4" />
                Billing
              </DropdownMenuItem>

              {/* Light / Dark / System */}
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  {theme === "light" && <Sun className="h-4 w-4" />}
                  {theme === "dark" && <Moon className="h-4 w-4" />}
                  {theme === "system" && <Monitor className="h-4 w-4" />}
                  Theme
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuRadioGroup value={theme} onValueChange={(value) => handleThemeChange(value as "light" | "dark" | "system")}>
                    <DropdownMenuRadioItem value="light">
                      <Sun className="h-4 w-4 mr-2" />
                      Light
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="dark">
                      <Moon className="h-4 w-4 mr-2" />
                      Dark
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="system">
                      <Monitor className="h-4 w-4 mr-2" />
                      System
                    </DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuSubContent>
              </DropdownMenuSub>

              {/* Color Theme */}
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <Palette className="h-4 w-4" />
                  Color
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuRadioGroup value={colorTheme} onValueChange={handleColorThemeChange}>
                    {COLOR_THEMES.map((ct) => (
                      <DropdownMenuRadioItem key={ct.value} value={ct.value}>
                        <span
                          className="inline-block h-3.5 w-3.5 rounded-full mr-2 border border-border"
                          style={{ backgroundColor: ct.swatch }}
                        />
                        {ct.label}
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <LogOut className="h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
