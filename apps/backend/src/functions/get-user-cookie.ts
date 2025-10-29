import { Request } from "express";

export default function getUserCookie(req: Request): string {
  const data = req.headers.cookie;
  let cookie: string = "";
  let first = 0;

  data?.split("; ").map((v) => {
    if (v.split("=")[0] === "ImeshVisitor" || v.split("=")[0] === "im_iss") {
      if (first === 0) {
        cookie += `${v};`;
      } else {
        cookie += ` ${v};`;
      }
      first++;
    }
  });

  return cookie;
}
