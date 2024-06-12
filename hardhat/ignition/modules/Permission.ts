import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const PermissionModule = buildModule("PermissionModule", (m) => {
  const contract = m.contract("Permission");

  return { contract };
});

export default PermissionModule;
