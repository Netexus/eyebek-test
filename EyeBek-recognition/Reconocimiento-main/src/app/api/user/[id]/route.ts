
import UsersModel from "@/database/user";
import { dbConnection } from "@/lib/dbConnect";

export async function GET(req, context) {
  const params = await context.params;   // ✔ obligatorio

  await dbConnection();

  const user = await UsersModel.findById(params.id);

  if (!user) {
    return Response.json({ error: "Usuario no encontrado" }, { status: 404 });
  }

  return Response.json({
    image: user.image,
  });
}
