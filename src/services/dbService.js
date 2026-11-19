
const API_URL = "http://localhost:3002";

export async function getSchedules() {
  const response = await fetch(`${API_URL}/schedules`);

  if (!response.ok) {
    throw new Error("Gagal mengambil data jadwal.");
  }

  return response.json();
}

export async function createSchedule(schedule) {
  const response = await fetch(`${API_URL}/schedules`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(schedule),
  });

  if (!response.ok) {
    throw new Error("Gagal menyimpan jadwal.");
  }

  return response.json();
}

export async function publishSchedule(id) {
  const response = await fetch(`${API_URL}/schedules/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      published: true,
      status: "Dipublikasikan",
    }),
  });

  if (!response.ok) {
    throw new Error("Gagal memublikasikan jadwal.");
  }

  return response.json();
}
