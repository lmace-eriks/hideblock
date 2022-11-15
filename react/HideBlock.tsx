import React, { useEffect, useRef, useState, ReactChildren } from "react";
// import { createPortal } from "react-dom";
import { canUseDOM } from "vtex.render-runtime";

import styles from "./styles.css";

interface HideBlockProps {
  children: ReactChildren
  containerQuerySelector: string
  targetQuerySelector: string
  hideIfTargetIs: MatchEnum
}

enum MatchEnum {
  present = "present",
  missing = "missing"
}

const HideBlock: StorefrontFunctionComponent<HideBlockProps> = ({ children, containerQuerySelector, targetQuerySelector, hideIfTargetIs }) => {
  const openGate = useRef(true);
  const [showChildren, setShowChildren] = useState(false);

  useEffect(() => {
    if (!openGate.current) return;
    openGate.current = false;

    searchForContainer();
    searchForTrigger();
  })

  useEffect(() => {
    if (!canUseDOM) return;
    window.addEventListener("message", handleMessage);
    return () => {
      window.removeEventListener("message", handleMessage);
    }
  })

  const searchForContainer = () => {
    if (!canUseDOM) return;

    const targetNode = document.querySelector(containerQuerySelector);
    const config = { attributes: false, childList: true, subtree: true };

    if (!targetNode) return;
    const observer = new MutationObserver(searchForTrigger);
    observer.observe(targetNode, config);
  }

  const searchForTrigger = () => {
    if (!canUseDOM) return;

    const trigger = document.querySelector(targetQuerySelector);

    if (trigger) {
      hideIfTargetIs === "present" ? setShowChildren(false) : setShowChildren(true);
    } else {
      hideIfTargetIs === "missing" ? setShowChildren(false) : setShowChildren(true);
    }
  }

  const handleMessage = (e: any) => {
    const eventName = e.data.eventName;
    if (!eventName) return;
    if (eventName === "vtex:pageView") searchForTrigger();
  }

  return showChildren ? <>{children}</> : null;
}

HideBlock.schema = {
  title: "Store Banner",
  type: "object",
  properties: {}
}

export default HideBlock;