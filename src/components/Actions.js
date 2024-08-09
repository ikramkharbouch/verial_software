import Button from "./Button.js";

import {
  PlusCircleFilled,
  CodepenOutlined,
  DeleteFilled,
  SearchOutlined,
  FileTextOutlined,
  CalculatorOutlined,
  SwapOutlined,
  ApartmentOutlined,
  RadiusSettingOutlined,
  FieldTimeOutlined,
  DownloadOutlined,
  ClockCircleOutlined
} from "@ant-design/icons";

const Actions = () => {
  return (
    <div className="m-5 flex gap-5 flex-wrap font-medium text-sm">
      <Button
        styles="bg-green-500 text-white w-32 text-center"
        content="New Client"
      >
        <PlusCircleFilled />
      </Button>
      <Button
        styles="border border-1 border-yellow-500 text-yellow-600 text-border-size-1 w-32 text-center"
        content="Modify"
      >
        <CodepenOutlined />
      </Button>
      <Button
        styles="border border-1 border-red-700 text-red-700 text-border-size-1 w-32 text-center"
        content="Delete"
      >
        <DeleteFilled />
      </Button>

      <Button
        styles="border border-1 border-black text-border-size-1 w-max text-center"
        content="Search"
      ><SearchOutlined /></Button>
      <Button
        styles="border border-1 border-black text-border-size-1 w-max text-center"
        content="Comment"
      ><FileTextOutlined /></Button>

      <Button
        styles="border border-1 border-black text-border-size-1 w-max text-center"
        content="Operations"
      ><RadiusSettingOutlined /></Button>
      <Button
        styles="border border-1 border-black text-border-size-1 w-max text-center"
        content="Directions"
      ><SwapOutlined /></Button>
      <Button
        styles="border border-1 border-black text-border-size-1 w-max text-center"
        content="Processes"
      ><ApartmentOutlined /></Button>
      <Button
        styles="border border-1 border-black text-border-size-1 w-max text-center"
        content="Calculate balance"
      ><CalculatorOutlined /></Button>

      <Button
        styles="border border-1 border-red-700 border-red-700 text-red-700 text-border-size-1 w-max text-center"
        content="Urgent changes"
      ><FieldTimeOutlined /></Button>
      <Button
        styles="border border-1 border-black text-border-size-1 w-max text-center"
        content="Download Bill"
      ><DownloadOutlined /></Button>
      <Button
        styles="bg-yellow-400 text-border-size-1 w-max text-center"
        content="Pending Article"
      ><ClockCircleOutlined /></Button>
    </div>
  );
};

export default Actions;
