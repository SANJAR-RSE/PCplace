from aiogram import Router

from . import bookings, clubs, profile, start

router = Router(name="root")
router.include_router(start.router)
router.include_router(profile.router)
router.include_router(clubs.router)
router.include_router(bookings.router)
