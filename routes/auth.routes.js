const { Router } = require('express')
const User = require('../models/User')
const bcrypt = require('bcryptjs')
const config = require('config')
const jwt = require('jsonwebtoken')
const { check, validationResult } = require('express-validator')
const router = Router()

// /auth/registration
router.post(
	'/register',
	[
		check('email', 'Некорректный email').isEmail(),
		check('password', 'Минимальная длина пароля 3 символа').isLength({ min: 3 })
	],
	async (req, res) => {
		try {
			const errors = validationResult(req)
			if (!errors.isEmpty()) {
				return res.status(400).json({
					errors: errors.array(),
					message: 'Некорректные данные при регистрации'
				})
			}

			const { email, password } = req.body

			const candidate = await User.findOne({ email })

			if (candidate) {
				return res.json({ message: 'Пользователь с таким email уже существует' })
			}

			const hashedPassword = await bcrypt.hash(password, 8)

			const user = new User({ email, password: hashedPassword })
			await user.save()
			res.status(201).json({ message: 'Пользователь создан' })
		} catch (e) {
			console.log(e)
		}
	})

// /auth/login
router.post('/login',
	[
		check('email', 'Некорректный email').normalizeEmail().isEmail(),
		check('password', 'Минимальная длина пароля 3 символа').exists()
	],
	async (req, res) => {
		try {
			const errors = validationResult(req)
			if (!errors.isEmpty()) {
				return res.status(400).json({
					errors: errors.array(),
					message: 'Некорректные данные при входе в систему'
				})
			}

			const { email, password } = req.body

			const user = await User.findOne({ email })

			if (!user) {
				return res.status(400).json({ message: 'Пользователь не найден' })
			}

			const isMatch = await bcrypt.compare(password, user.password)

			if (!isMatch) {
				return res.status(400).json({ message: 'Неверный пароль, попробуйте снова' })
			}

			const token = jwt.sign(
				{ userId: user.id },
				config.get('jwtSecret'),
				{ expiresIn: '1h' }
			)

			res.json({
				token,
				userId: user.id
			})

		} catch (e) {
			console.log(e)
		}
	})

module.exports = router