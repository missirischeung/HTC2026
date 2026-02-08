import { Routes, Route, Navigate } from "react-router-dom";
import RecipeSelect from "./pages/RecipeSelect";
import Cook from "./pages/Cook";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<RecipeSelect />} />
      <Route path="/cook/:recipeId" element={<Cook />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
