task(
  "deployRWA",
  "Deploy RWA contract with cToken",
  require("./deployRWAContracts")
);

task(
  "deployCLMOracle",
  "Deploy CLM Oracle contract",
  require("./deployCLMOracle")
);

task(
  "setComptrollerProps",
  "Set comptroller props",
  require("./setComptrollerProps")
);
