import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  vus: 50,
  duration: "1m",
  thresholds: {
    http_req_duration: ["p(95)<500"],
  },
};

export default function () {
  const antwort = http.get("http://localhost:3001/rezepte");
  check(antwort, {
    "Status ist 200": (r) => r.status === 200,
  });
  sleep(1);
}
