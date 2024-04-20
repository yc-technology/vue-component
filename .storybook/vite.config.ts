import Vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vitest/config'
import tailwindcss from 'tailwindcss'
import { UserConfigExport } from 'vite'

const app = async (): Promise<UserConfigExport> => {
  return defineConfig({
    plugins: [Vue()],
    css: {
      postcss: {
        plugins: [tailwindcss]
      }
    }
  })
}
// https://vitejs.dev/config/
export default app
