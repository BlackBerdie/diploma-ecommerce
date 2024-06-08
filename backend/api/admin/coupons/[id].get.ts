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
  const couponSQL = await pool.query('SELECT * FROM "Coupons" WHERE id = $1', [
    +id,
  ]);

  if (couponSQL.rows.length === 0) {
    throw createError({
      statusCode: 404,
    });
  }

  const coupon = couponSQL.rows[0];
  const rulesSQL = await pool.query(
    'SELECT * FROM "Coupon_Rules" WHERE coupon_id = $1',
    [coupon.id]
  );

  await pool.end();

  return {
    ...coupon,
    rules: rulesSQL.rows,
  };
});
