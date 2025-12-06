### 项目配置drizzle

```bash
npm i drizzle-orm pg dotenv
npm i -D drizzle-kit tsx @types/pg
```

需要创建.env
```text
DATABASE_URL="postgresql://next:next@localhost:5432/next?schema=public"
```

lib/db.ts
```ts
import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
const db = drizzle(process.env.DATABASE_URL!);
export default db;
```

app/db/schema.ts
```ts
import { integer, pgTable, varchar } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
id: integer().primaryKey().generatedAlwaysAsIdentity(),
name: varchar({ length: 255 }).notNull(),
age: integer().notNull(),
email: varchar({ length: 255 }).notNull().unique(),
});

```

drizzle.config.ts
```ts
import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
    out: './drizzle',
    schema: './app/db/schema.ts',
    dialect: 'postgresql',
    dbCredentials: {
        url: process.env.DATABASE_URL!,
    },
});
```

改动schema后使用这个命令应用到数据库
```bash
npx drizzle-kit push
```


### 项目配置tiptap

安装
```bash
npm install @tiptap/react @tiptap/pm @tiptap/starter-kit
```

简单使用
```tsx
// Tiptap.tsx 后续在nextjs中插入即可
'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

const Tiptap = () => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: '<p>Hello World! 🌎️</p>',
    // Don't render immediately on the server to avoid SSR issues
    immediatelyRender: false,
  })

  return <EditorContent editor={editor} />
}

export default Tiptap
```

https://tiptap.dev/docs/editor/extensions/functionality/bubble-menu
https://tiptap.dev/docs/editor/core-concepts/persistence