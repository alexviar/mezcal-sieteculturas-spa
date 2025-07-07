import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { CartState, Product } from "@/models/entities";

interface FormState {
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  zipCode: string;
  phone: string;
  state: string;
  city: string;
}

const initialFormState: FormState = {
  firstName: "",
  lastName: "",
  email: "",
  address: "",
  zipCode: "",
  phone: "",
  state: "",
  city: "",
};

const sumShippingValues = (items: Product[]) => {
  return items.reduce((sum, item) => sum + item.shippingValue, 0);
};

const initialState: CartState & {
  quantities: { [key: number]: number };
  subtotal: number;
  /* tax: number; */
  deliverySum: number;
  grandTotal: number;
  form: FormState;
} = {
  items: [],
  total: 0,
  quantities: {},
  subtotal: 0,
  /*  tax: 0, */
  deliverySum: 0,
  grandTotal: 0,
  form: initialFormState,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<Product>) => {
      if (action.payload && action.payload.id !== undefined) {
        const existingItem = state.items.find(
          (item) => item.id === action.payload.id
        );

        if (!existingItem) {
          state.items.push(action.payload);
          state.quantities[action.payload.id] = 1;
          state.total = state.items.length;
        } else {
          state.quantities[existingItem.id] += 1;
        }

        const subtotal = state.items.reduce(
          (sum, item) => sum + item.price * (state.quantities[item.id] || 1),
          0
        );
        state.subtotal = subtotal;
        /* state.tax = subtotal * 0.19; */
        state.deliverySum = sumShippingValues(state.items);
        state.grandTotal = subtotal + /* state.tax + */ state.deliverySum;
      } else {
        console.error("Invalid item payload", action.payload);
      }
    },

    removeItem: (state, action: PayloadAction<number>) => {
      const index = state.items.findIndex((item) => item.id === action.payload);
      if (index !== -1) {
        const productId = state.items[index].id;
        delete state.quantities[productId];
        state.items.splice(index, 1);
        state.total = Math.max(0, state.total - 1);

        const subtotal = state.items.reduce(
          (sum, item) => sum + item.price * (state.quantities[item.id] || 1),
          0
        );
        state.subtotal = subtotal;
        /*  state.tax = subtotal * 0.19; */
        state.deliverySum = sumShippingValues(state.items);
        state.grandTotal = subtotal + /* state.tax + */ state.deliverySum;
      }
    },

    incrementQuantity: (state, action: PayloadAction<number>) => {
      const productId = action.payload;
      if (state.quantities[productId]) {
        state.quantities[productId] += 1;
      }

      const subtotal = state.items.reduce(
        (sum, item) => sum + item.price * (state.quantities[item.id] || 1),
        0
      );
      state.subtotal = subtotal;
      /*  state.tax = subtotal * 0.19; */
      state.deliverySum = sumShippingValues(state.items);
      state.grandTotal = subtotal + /* state.tax + */ state.deliverySum;
    },

    decrementQuantity: (state, action: PayloadAction<number>) => {
      const productId = action.payload;
      if (state.quantities[productId] > 1) {
        state.quantities[productId] -= 1;
      }

      const subtotal = state.items.reduce(
        (sum, item) => sum + item.price * (state.quantities[item.id] || 1),
        0
      );
      state.subtotal = subtotal;
      /*  state.tax = subtotal * 0.19; */
      state.deliverySum = sumShippingValues(state.items);
      state.grandTotal = subtotal + /* state.tax + */ state.deliverySum;
    },

    cleanCart: (state) => {
      state.items = [];
      state.quantities = {};
      state.subtotal = 0;
      /* state.tax = 0; */
      state.deliverySum = 0;
      state.grandTotal = 0;
      state.total = 0;
    },

    setForm: (state, action: PayloadAction<FormState>) => {
      state.form = action.payload;
    },

    resetForm: (state) => {
      state.form = initialFormState;
    },
  },
});

export const {
  addItem,
  removeItem,
  incrementQuantity,
  decrementQuantity,
  cleanCart,
  setForm,
  resetForm,
} = cartSlice.actions;

export default cartSlice.reducer;
