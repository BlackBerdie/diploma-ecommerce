import * as pg from "pg";
import {
  generateToken,
  isValidToken,
  getInfoFromToken,
} from "~~/backend/utils/adminToken";

const { Pool } = pg.default;

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id;
  if (id === undefined) {
    throw createError({
      statusCode: 400,
    });
  }

  const token = getCookie(event, "token");
  if (!isValidToken(token)) {
    throw createError({
      statusCode: 403,
    });
  }
  setCookie(event, "token", generateToken(getInfoFromToken(token!)!.id));

  const pool = new Pool({
    ssl: {
      mode: "require",
    },
  });
  const promotionSQL = await pool.query(
    'SELECT * FROM "Promotions" WHERE id = $1',
    [+id]
  );

  if (promotionSQL.rows.length === 0) {
    throw createError({
      statusCode: 404,
    });
  }

  const promotion = promotionSQL.rows[0];
  const rulesSQL = await pool.query(
    'SELECT * FROM "Promotion_Rules" WHERE promotion_id = $1',
    [promotion.id]
  );

  await pool.end();

  return {
    ...promotion,
    rules: rulesSQL.rows,
  };
});
