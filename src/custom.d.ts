declare module "*.jsx" {
  import React from "react";
  const component: React.ComponentType<any>;
  export default component;
}

declare module "*.css" {
  const content: any;
  export default content;
}
