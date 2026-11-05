import { test, expect } from '@playwright/test'
import { readFile } from 'node:fs/promises'

test('tema escuro padrão e preferência persistente antes da primeira pintura', async ({ page, context }) => {
  await page.goto('/')
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
  await page.getByRole('button', { name: 'Tema claro' }).click()
  await page.addInitScript(() => {
    requestAnimationFrame(() => {
      document.documentElement.dataset.themeAtFirstFrame = document.documentElement.dataset.theme
    })
  })
  await page.reload()
  await expect(page.locator('html')).toHaveAttribute('data-theme-at-first-frame', 'light')
  await expect(page.getByRole('button', { name: 'Tema claro' })).toHaveAttribute('aria-pressed', 'true')
  const other = await context.newPage()
  await other.goto('/')
  await other.getByRole('button', { name: 'Tema claro' }).click()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
})

test('alternância funciona com armazenamento bloqueado', async ({ page }) => {
  await page.addInitScript(() => {
    Storage.prototype.getItem = () => { throw new DOMException('Bloqueado', 'SecurityError') }
    Storage.prototype.setItem = () => { throw new DOMException('Bloqueado', 'SecurityError') }
  })
  await page.goto('/')
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
  await page.getByRole('button', { name: 'Tema claro' }).click()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')
})

test('CV separado baixa o PDF real e a navegação acompanha a seção', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/')
  await page.getByRole('navigation', { name: 'Navegação principal' }).getByRole('link', { name: 'Projetos', exact: true }).click()
  await expect(page.locator('header a[href="#projetos"]')).toHaveAttribute('aria-current', 'location')
  const pending = page.waitForEvent('download')
  await page.locator('header a[download]').click()
  const download = await pending
  expect(download.suggestedFilename()).toBe('enzo-nukui-cv.pdf')
  expect(await readFile((await download.path())!)).toEqual(await readFile('public/cv/enzo-nukui-cv.pdf'))
  expect(await page.locator('header nav').evaluate(nav => !nav.parentElement!.contains(document.querySelector('header a[download]')))).toBe(true)
})

test('layout sem overflow e navegação desktop centrada independentemente do CV', async ({ page }) => {
  await page.goto('/')
  await page.evaluate(() => document.fonts.ready)
  for (const width of [320, 375, 768, 1024, 1100, 1280, 1440, 1920]) {
    await page.setViewportSize({ width, height: 900 })
    const metrics = await page.evaluate(() => {
      const capsule = document.querySelector('header nav')!.parentElement!.getBoundingClientRect()
      const cv = document.querySelector('header a[download]')!.getBoundingClientRect()
      return { overflow: document.documentElement.scrollWidth - innerWidth,
        centerError: Math.abs(capsule.left + capsule.width / 2 - innerWidth / 2),
        cvVisible: cv.left >= 0 && cv.right <= innerWidth }
    })
    expect(metrics.overflow, `Overflow na largura ${width}`).toBe(0)
    expect(metrics.cvVisible).toBe(true)
    if (width >= 1100) expect(metrics.centerError).toBeLessThan(1)
  }
})

test('menu mantém foco, fecha com Escape e leva ao destino por teclado', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 740 })
  await page.goto('/')
  const trigger = page.getByRole('button', { name: 'Abrir navegação' })
  const dialog = page.getByRole('dialog')
  await trigger.click()
  await expect(dialog).toBeVisible()
  for (let index = 0; index < 10; index++) {
    await page.keyboard.press('Tab')
    expect(await dialog.evaluate(e => e.contains(document.activeElement))).toBe(true)
  }
  await page.keyboard.press('Escape')
  await expect(dialog).not.toBeVisible()
  await expect(trigger).toBeFocused()
  await trigger.press('Enter')
  const contact = dialog.getByRole('link', { name: '08 Contato' })
  await contact.focus()
  await contact.press('Enter')
  await expect(dialog).not.toBeVisible()
  await expect(page.locator('#contato')).toBeFocused()
  await expect.poll(() => page.evaluate(() => document.body.style.overflow)).not.toBe('hidden')
  await page.getByRole('link', { name: 'Voltar ao topo' }).click()
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeLessThan(10)
})

test('cursor contextual preserva teclado e é desativado com movimento reduzido', async ({ page }) => {
  await page.goto('/')
  await page.mouse.move(10, 220)
  await expect(page.locator('html')).toHaveAttribute('data-custom-cursor', 'true')
  await page.locator('header a[download]').hover()
  await expect(page.getByText('BAIXAR', { exact: true })).toBeVisible()
  await page.keyboard.press('Tab')
  await expect(page.locator('html')).not.toHaveAttribute('data-custom-cursor')
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.mouse.move(10, 240)
  await expect(page.locator('html')).not.toHaveAttribute('data-custom-cursor')
  expect(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior)).toBe('auto')
  await page.setViewportSize({ width: 375, height: 812 })
  await page.getByRole('button', { name: 'Abrir navegação' }).click()
  await page.getByRole('button', { name: 'Fechar navegação' }).click()
  await expect(page.getByRole('dialog')).not.toBeVisible()
})

test('touch mantém cursor nativo e permite abrir e fechar o menu', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 375, height: 812 }, isMobile: true, hasTouch: true })
  const page = await context.newPage()
  await page.goto('http://127.0.0.1:5173/')
  await page.getByRole('button', { name: 'Abrir navegação' }).tap()
  await expect(page.getByRole('dialog')).toBeVisible()
  await page.getByRole('button', { name: 'Fechar navegação' }).tap()
  await expect(page.getByRole('dialog')).not.toBeVisible()
  await expect(page.locator('html')).not.toHaveAttribute('data-custom-cursor')
  await context.close()
})

test('página e fontes locais carregam sem erros de console ou rede', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', error => errors.push(error.message))
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()) })
  page.on('response', response => { if (response.status() >= 400) errors.push(response.url()) })
  await page.goto('/')
  await page.evaluate(() => document.fonts.ready)
  expect(await page.evaluate(() => document.fonts.check('500 16px "Instrument Sans Variable"'))).toBe(true)
  expect(await page.evaluate(() => document.fonts.check('700 16px "Syne Variable"'))).toBe(true)
  expect(errors).toEqual([])
})
