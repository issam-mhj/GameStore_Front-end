
import {
  createBrowserRouter,
  RouterProvider,

} from "react-router-dom";
import Defaultpage from "../Pages/Defaultpage";
import Guestpage from "../Pages/guestpage";


const router = createBrowserRouter([
  {
    path: "/default",
    element: <Defaultpage />,
  },
  {
    path: "/guest",
    element: <Guestpage />,
  },
]);

export default router ;
