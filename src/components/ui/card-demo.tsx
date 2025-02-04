"use client";
import { CardBody, CardContainer, CardItem } from "../ui/3d-card";

export default function ThreeDCardDemo() {
  return (
    <CardContainer className="inter-var">
      <CardBody className="w-100px h-500px">
        <CardItem translateZ="20" className="w-full h-full">
          <img
            src="./dust/cards/mist-f.jpg"
            className="h-full w-full object-cover rounded-md group-hover/card:shadow-xl"
            alt="thumbnail"
          />
        </CardItem>
      </CardBody>
    </CardContainer>
  );
}
