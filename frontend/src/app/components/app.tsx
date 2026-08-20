import { AppRoutes } from "./app-routes";
import { AtmosphereProvider } from "./theme/atmosphere-provider";

function App() {
  return (
    <AtmosphereProvider>
      <AppRoutes />
    </AtmosphereProvider>
  );
}

export default App;
