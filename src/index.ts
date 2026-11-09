import { createApp } from "./ui/handlers";

const root = document.createElement("div");
root.id = "root";
document.body.append(root);

createApp(root);
