import { BookMarked, Layers, ListTodo, type LucideIcon } from "lucide-react";
import { type ComponentType, lazy } from "react";

import { NotesDetail, NotesList } from "@/notes";
import { TasksDetail, TasksList } from "@/task-manager";

export const LAST_VISITED_KEY = "lastVisitedApp";
export const DEFAULT_LAST_VISITED = "/tasks";

export type AppModule = {
  id: string;
  title: string;
  path: string;
  url: string;
  icon: LucideIcon;
  nav: boolean;
  remember: boolean;
  List: ComponentType;
  Detail?: ComponentType;
};

const productModules: AppModule[] = [
  {
    id: "tasks",
    title: "Task Manager",
    path: "tasks",
    url: "/tasks",
    icon: ListTodo,
    nav: true,
    remember: true,
    List: TasksList,
    Detail: TasksDetail,
  },
  {
    id: "notes",
    title: "Notes Manager",
    path: "notes",
    url: "/notes",
    icon: BookMarked,
    nav: true,
    remember: true,
    List: NotesList,
    Detail: NotesDetail,
  },
];

const DevDesignSystem = import.meta.env.DEV
  ? lazy(() => import("@/dev/design-system/routes"))
  : null;

const devModules: AppModule[] = DevDesignSystem
  ? [
      {
        id: "design-system",
        title: "Design system",
        path: "design-system",
        url: "/design-system",
        icon: Layers,
        nav: true,
        remember: false,
        List: DevDesignSystem,
      },
    ]
  : [];

export const appModules: AppModule[] = [...productModules, ...devModules];

export const navModules = appModules.filter((mod) => mod.nav);
