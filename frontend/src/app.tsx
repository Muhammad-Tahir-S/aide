import AppRoutes from "./shared/app";
import { AtmosphereProvider } from "./shared/theme/atmosphere-provider";

function App() {
  return (
    <AtmosphereProvider>
      <AppRoutes />
    </AtmosphereProvider>
  );
}

export default App;
