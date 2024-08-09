import LeftMenu from "../components/LeftMenu.js";
import { Tabs } from "../components/Tabs.js";

/* Home Layout Page */
const Home = () => {
  return (
    <div className="flex">
      <LeftMenu />

      <div className="w-full">
        <Tabs />
      </div>
    </div>
  );
};

export default Home;
