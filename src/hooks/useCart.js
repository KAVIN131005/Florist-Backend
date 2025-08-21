import { useContext } from "react";
import { CartContext } from "../context/CartContextDefinition";

export const useCart = () => useContext(CartContext);
