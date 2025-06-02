import {MainConfig} from "@/config/config.js";

const mainConfig = MainConfig.getInstance()
mainConfig.loadConfig()
export const config = mainConfig.config


