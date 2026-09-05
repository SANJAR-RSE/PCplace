from aiogram.fsm.state import State, StatesGroup


class LoginFlow(StatesGroup):
    waiting_for_code = State()


class BookingFlow(StatesGroup):
    choosing_room = State()
    choosing_pc = State()
    entering_hours = State()
    choosing_snacks = State()
    confirming = State()
