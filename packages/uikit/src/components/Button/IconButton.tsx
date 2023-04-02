import styled from "styled-components";
import { PolymorphicComponent } from "../../util/polymorphic";
import Button from "./Button";
import { BaseButtonProps } from "./types";

const IconButton: PolymorphicComponent<BaseButtonProps, "button"> = styled(Button)<BaseButtonProps>`
padding: 0;
    background: #332b40;
    /* border: 2px solid #EE1A78; */
    width: 30px;
    height: 30px;
    border-radius: 5px;
    margin-top: 8px;
    margin-bottom: 8px;
`;

export default IconButton;
