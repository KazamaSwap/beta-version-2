import ItemsMock from "../DropdownMenu/mock";
import { MenuItemsType } from "../MenuItems/types";
import {
  SwapFillIcon,
  SwapIcon,
  EarnFillIcon,
  EarnIcon,
  NftFillIcon,
  NftIcon,
  MoreIcon,
  TrophyIcon,
  TrophyFillIcon,
} from "../Svg";

const MenuItemsMock: MenuItemsType[] = [
  {
    label: "Swap",
    href: "/swap",
    items: ItemsMock,
    showItemsOnMobile: false,
  },
  {
    label: "Earn",
    href: "/earn",
    items: ItemsMock,
    showItemsOnMobile: true,
  },
  {
    label: "Gagnez des jetons",
    href: "/win",
    items: ItemsMock,
    showItemsOnMobile: true,
  },
  {
    label: "NFT",
    href: "/nft",
    items: ItemsMock,
  },
  {
    label: "More",
    href: "/more",
    showItemsOnMobile: true,
  },
];

export default MenuItemsMock;
