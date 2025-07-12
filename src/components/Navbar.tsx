import * as React from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { UserContext } from "@/context/user-context"
import clsx from "clsx"
import { useContext } from "react"

export function Navbar() {
    const userContext = useContext(UserContext)
    const user = userContext?.state


  const navigate = useNavigate()
  const location = useLocation()
  const { dispatch } = React.useContext(UserContext)!

  const handleSignOut = () => {
    dispatch({ type: "LOGOUT" })
    localStorage.removeItem("user")
    navigate("/")
  }

  const getLinkClass = (path: string) =>
    clsx(navigationMenuTriggerStyle(), {
      "bg-muted font-semibold": location.pathname === path,
    })

  return (
    <NavigationMenu className="mb-5">
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuLink asChild className={getLinkClass("/")}>
            <Link to="/">Dashboard</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuLink asChild className={getLinkClass("/create")}>
            <Link to="/create">Create</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>

        <NavigationMenuItem className={user ? "" : "hidden"}>
          <button
            onClick={handleSignOut}
            className={navigationMenuTriggerStyle()}
          >
            Signout
          </button>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}
