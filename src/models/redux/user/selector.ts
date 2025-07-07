import { UserType } from "../../entities";
import { RootState } from "../store";

export const userSelector = (state: RootState): UserType | null =>
  state.user.user;
