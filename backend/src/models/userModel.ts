import bcrypt from 'bcrypt'
import { Pool, RowDataPacket } from "mysql2/promise"

interface UserCredentials {
  email: string
  password: string
}

interface UserIdRecord extends RowDataPacket {
  id: string
}

interface CountRecord extends RowDataPacket {
  count: number
}

interface UserRecord extends RowDataPacket {
  id: string,
  email: string,
  password: string
}

export class UserModel {
  private db: Pool

  constructor(db: Pool) {
    this.db = db
  }

  async create({ email, password }: UserCredentials): Promise<{ id: string; email: string }> {
    try {
      let hashedPass = null

      if (password) {
        hashedPass = await bcrypt.hash(password, parseInt(process.env.SALT_ROUNDS || "10", 10))
      }

      await this.db.query('START TRANSACTION')
      await this.db.query(
        'INSERT INTO users (id, email, password) VALUES (UUID(), ?, ?)',
        [email, hashedPass]
      )

      const [userIdQuery] = await this.db.query<UserIdRecord[]>( 'SELECT id FROM users WHERE email = ?', [email])

      await this.db.query('COMMIT')

      return { id: userIdQuery[0].id, email }

    } catch (error) {
      await this.db.query('ROLLBACK')
      throw error
    }
  }

  async emailExists({ email }: { email: string }): Promise<boolean> {
    const [emailQuery] = await this.db.query<CountRecord[]>(
      'SELECT COUNT(*) as count FROM users WHERE email = ?',
      [email]
    )
    return emailQuery.length > 0 && emailQuery[0].count > 0
  }

  async verifyCredentials({ email, password }: UserCredentials): Promise<{ id: string; email: string } | null> {
    const [userQuery] = await this.db.query<UserRecord[]>(
      'SELECT id, email, password FROM users WHERE email = ?',
      [email]
    )

    if (!userQuery.length) return null

    if (await bcrypt.compare(password, userQuery[0].password)) {
      return { id: userQuery[0].id, email: userQuery[0].email }
    }

    return null
  }
}