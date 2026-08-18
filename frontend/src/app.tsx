import AppRoutes from "./shared/app";
import { ThemeProvider } from "./shared/components/theme-provider";
import { AtmosphereProvider } from "./shared/theme/atmosphere-provider";

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <AtmosphereProvider>
        <AppRoutes />
      </AtmosphereProvider>
    </ThemeProvider>
  );
}

export default App;
