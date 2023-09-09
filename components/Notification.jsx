import React from "react";
import { Card, CardBody } from "@nextui-org/react";

function Component(props) {
  return (
    <Card className={`absolute bottom-0 right-0 px-2 bg-${props.type}`}>
      <CardBody>{props.message}</CardBody>
    </Card>
  );
}

export default Component;
