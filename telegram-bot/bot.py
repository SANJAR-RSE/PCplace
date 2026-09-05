import asyncio
import logging
import os

from aiogram import Bot, Dispatcher
from aiogram.client.default import DefaultBotProperties
from aiogram.enums import ParseMode
from aiogram.fsm.storage.memory import MemoryStorage
from aiohttp import web

from config import BOT_TOKEN
from handlers import router


async def _start_health_server() -> None:
    """Render kabi platformalarda 'web service' turi ochiq port talab qiladi
    (bepul tarifda background worker mavjud emas) — bot o'zi HTTP qabul qilmasa ham,
    shu yengil endpoint orqali platformaga "tirikligini" bildiradi."""
    port = int(os.environ.get("PORT", 8080))
    app = web.Application()
    app.router.add_get("/", lambda request: web.Response(text="PCplace bot ishlab turibdi"))
    runner = web.AppRunner(app)
    await runner.setup()
    site = web.TCPSite(runner, "0.0.0.0", port)
    await site.start()
    logging.info(f"Health-check server {port}-portda ishga tushdi")


async def main() -> None:
    logging.basicConfig(level=logging.INFO)

    bot = Bot(token=BOT_TOKEN, default=DefaultBotProperties(parse_mode=ParseMode.HTML))
    dp = Dispatcher(storage=MemoryStorage())
    dp.include_router(router)

    await bot.delete_webhook(drop_pending_updates=True)
    await _start_health_server()
    await dp.start_polling(bot)


if __name__ == "__main__":
    asyncio.run(main())
