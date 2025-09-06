import { useLazyGetProductQuery } from "@/api/services/productApi";
import { Product } from "@/models/entities";
import { updateItem } from "@/models/redux/cart/slice";
import { RootState } from "@/models/redux/store";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export const useUpdateCartItems = () => {
  const [cartItemsUpdated, setCartItemsUpdated] = useState(false);
  const itemsInCart: Product[] = useSelector(
    (state: RootState) => state.shoppingCart.items
  );
  const [getProduct] = useLazyGetProductQuery()
  const dispatch = useDispatch()

  useEffect(() => {
    Promise.all(itemsInCart.map(async item => {
      const product = await getProduct(item.id).unwrap()
      dispatch(updateItem(product))
    })).then(() => {
      setCartItemsUpdated(true)
    })
  }, [itemsInCart])

  return cartItemsUpdated
}