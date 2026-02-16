import * as React from "react"
import {
  ChevronsUpDown,
  Check,
} from "lucide-react"
import mayoLogo from 'figma:asset/a9bd9c428ec870c1ad5a631d9a5feb14b653a96d.png'
import { ImageWithFallback } from '../figma/ImageWithFallback'
import { FontAwesomeIcon, type IconName } from "../brand/font-awesome-icon"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "../ui/sidebar"

export function TeamSwitcher({
  teams,
  isCollapsed: isCollapsedProp,
  onProgramChange,
}: {
  teams: {
    name: string
    logo: React.ElementType | string
    plan: string
  }[]
  isCollapsed?: boolean
  onProgramChange?: (programName: string) => void
}) {
  const { isMobile, state } = useSidebar()
  const [activeTeam, setActiveTeam] = React.useState(teams[0])
  const isCollapsed = isCollapsedProp ?? state === "collapsed"

  const handleProgramSelect = (team: typeof teams[0]) => {
    setActiveTeam(team)
    onProgramChange?.(team.name)
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
              <div className={`flex aspect-square size-8 items-center justify-center rounded-lg bg-background border border-border shrink-0 ${isCollapsed ? "mx-auto" : ""}`}>
                <ImageWithFallback 
                  src={mayoLogo} 
                  alt="University"
                  className="size-6 object-contain"
                />
              </div>
              {!isCollapsed && (
                <>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">University of California</span>
                    <span className="truncate text-xs text-muted-foreground">{activeTeam.name}</span>
                  </div>
                  <ChevronsUpDown className="ml-auto size-4 text-muted-foreground" />
                </>
              )}
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg z-[100]"
            align="start"
            side={isCollapsed ? "right" : "bottom"}
            sideOffset={isCollapsed ? 8 : 4}
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Programs
            </DropdownMenuLabel>
            {teams.map((team) => (
              <DropdownMenuItem
                key={team.name}
                onClick={() => handleProgramSelect(team)}
                className="gap-2 p-2"
              >
                <FontAwesomeIcon
                  name={typeof team.logo === 'string' ? team.logo as IconName : "graduation-cap" as IconName}
                  weight={activeTeam.name === team.name ? "solid" : "regular"}
                  className="size-4 text-muted-foreground"
                />
                <div className="flex flex-col flex-1">
                  <span className="text-sm">{team.name}</span>
                  <span className="text-xs text-muted-foreground">{team.plan}</span>
                </div>
                {activeTeam.name === team.name && (
                  <Check className="ml-auto size-4 text-primary" />
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}