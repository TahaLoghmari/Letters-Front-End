import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu";
import { CirclePlus } from "lucide-react";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { States } from "./App";

export default function NavBar() {
  const { GameList, CategoryList } = useContext(States);
  return (
    <div>
      <NavigationMenu>
        <NavigationMenuLink
          className="group bg-background hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground data-[active=true]:bg-accent/50 data-[state=open]:bg-accent/50 data-[active=true]:text-accent-foreground ring-ring/10 dark:ring-ring/20 dark:outline-ring/40 outline-ring/50 inline-flex h-9 w-max cursor-pointer items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-[color,box-shadow] focus-visible:ring-4 focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50"
          asChild
        >
          <Link to="/">Home</Link>
        </NavigationMenuLink>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Games</NavigationMenuTrigger>
            <NavigationMenuContent>
              {GameList.map((Game) => (
                <NavigationMenuLink
                  key={Game.id}
                  asChild
                  className="cursor-pointer"
                >
                  <Link to={`/games/${Game.id}`}>{Game.name}</Link>
                </NavigationMenuLink>
              ))}
              <NavigationMenuLink className="w-40" asChild>
                <Link
                  className="cursor-pointer flex-row items-center gap-2"
                  to="games/create"
                >
                  <CirclePlus className="text-primary" />
                  <p className="leading-7 [&:not(:first-child)]:mt-0">
                    Add a Game
                  </p>
                </Link>
              </NavigationMenuLink>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Categories</NavigationMenuTrigger>
            <NavigationMenuContent>
              {CategoryList.map((Category) => (
                <NavigationMenuLink
                  key={Category.id}
                  asChild
                  className="cursor-pointer"
                >
                  <Link to={`/categories/${Category.id}`}>{Category.name}</Link>
                </NavigationMenuLink>
              ))}
              <NavigationMenuLink className="w-40" asChild>
                {/* Categories generated from the BD */}
                <Link
                  className="cursor-pointer flex-row items-center gap-2"
                  to="categories/create"
                >
                  <CirclePlus className="text-primary" />
                  <p className="leading-7 [&:not(:first-child)]:mt-0">
                    Add a Category
                  </p>
                </Link>
              </NavigationMenuLink>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}
