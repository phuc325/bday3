const state = {
    times: new Set(),
    foods: new Set(),
    customFood: "",
};

const screens = [...document.querySelectorAll(".screen")];
const toast = document.getElementById("toast");

function showScreen(name) {
    screens.forEach((screen) => {
        screen.classList.toggle("active", screen.dataset.screen === name);
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
    burstHearts(name === "final" ? 28 : 9);
}

function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(showToast.timeoutId);
    showToast.timeoutId = setTimeout(() => {
        toast.classList.remove("show");
    }, 2300);
}

function burstHearts(amount = 12) {
    const holder = document.getElementById("floating-hearts");
    const icons = ["💗", "💞", "✨", "💕", "🎂"];

    for (let index = 0; index < amount; index += 1) {
        const heart = document.createElement("span");
        heart.className = "floating-heart";
        heart.textContent = icons[Math.floor(Math.random() * icons.length)];
        heart.style.left = `${Math.random() * 100}%`;
        heart.style.fontSize = `${16 + Math.random() * 18}px`;
        heart.style.animationDuration = `${3.2 + Math.random() * 2.8}s`;
        heart.style.animationDelay = `${Math.random() * 0.55}s`;
        holder.appendChild(heart);

        heart.addEventListener("animationend", () => heart.remove());
    }
}

document.querySelectorAll("[data-next]").forEach((button) => {
    button.addEventListener("click", () => showScreen(button.dataset.next));
});

document.getElementById("accept-love").addEventListener("click", (event) => {
    const button = event.currentTarget;
    button.textContent = "đã kí hợp đồng nàm dợ forever ✓ 💍";
    button.disabled = true;
    burstHearts(18);
    setTimeout(() => showScreen("time"), 850);
});

document.querySelectorAll("#time-options .choice-button").forEach((button) => {
    button.addEventListener("click", () => {
        const value = button.dataset.value;
        button.classList.toggle("selected");

        if (button.classList.contains("selected")) {
            state.times.add(value);
        } else {
            state.times.delete(value);
        }

        document.getElementById("time-error").textContent = "";
    });
});

document.getElementById("time-continue").addEventListener("click", () => {
    if (state.times.size === 0) {
        document.getElementById("time-error").textContent =
            "chọn mụt bủi đyyy, ank ckuaa đọc đc suy nghĩ eiu douu hehe ";
        return;
    }

    showScreen("food");
});

const foodButtons = [...document.querySelectorAll("#food-options .choice-button")];
const otherFoodButton = document.getElementById("other-food-button");
const customFoodWrap = document.getElementById("custom-food-wrap");
const customFoodInput = document.getElementById("custom-food");
const secretFoodButton = document.getElementById("secret-food");

function clearFoodSelections(exceptButton = null) {
    foodButtons.forEach((button) => {
        if (button !== exceptButton) {
            button.classList.remove("selected");
        }
    });

    if (secretFoodButton !== exceptButton) {
        secretFoodButton.classList.remove("selected");
    }

    state.foods.clear();
}

foodButtons.forEach((button) => {
    button.addEventListener("click", () => {
        const value = button.dataset.value;
        const isExclusive = button.dataset.exclusive === "true";

        if (isExclusive) {
            const willSelect = !button.classList.contains("selected");
            clearFoodSelections(button);
            button.classList.toggle("selected", willSelect);
            customFoodWrap.hidden = true;
            customFoodInput.value = "";
            state.customFood = "";

            if (willSelect) {
                state.foods.add(value);
            }
        } else {
            const exclusiveButton = foodButtons.find(
                (item) => item.dataset.exclusive === "true"
            );

            if (exclusiveButton?.classList.contains("selected")) {
                exclusiveButton.classList.remove("selected");
                state.foods.delete(exclusiveButton.dataset.value);
            }

            button.classList.toggle("selected");

            if (button.classList.contains("selected")) {
                state.foods.add(value);
            } else {
                state.foods.delete(value);
            }

            if (button === otherFoodButton) {
                customFoodWrap.hidden = !button.classList.contains("selected");
                if (!customFoodWrap.hidden) {
                    setTimeout(() => customFoodInput.focus(), 80);
                } else {
                    customFoodInput.value = "";
                    state.customFood = "";
                }
            }
        }

        document.getElementById("food-error").textContent = "";
    });
});

secretFoodButton.addEventListener("click", () => {
    const exclusiveButton = foodButtons.find(
        (item) => item.dataset.exclusive === "true"
    );

    if (exclusiveButton?.classList.contains("selected")) {
        exclusiveButton.classList.remove("selected");
        state.foods.delete(exclusiveButton.dataset.value);
    }

    secretFoodButton.classList.toggle("selected");

    if (secretFoodButton.classList.contains("selected")) {
        state.foods.add("Bánh tráng 🤫");
        showToast("eiu tìm thấy món bí mật gouuu 🤫💗");
    } else {
        state.foods.delete("Bánh tráng 🤫");
    }
});

customFoodInput.addEventListener("input", () => {
    state.customFood = customFoodInput.value.trim();
});

function selectedFoodsForDisplay() {
    const foods = [...state.foods].filter((food) => food !== "Khác");
    if (state.foods.has("Khác") && state.customFood) {
        foods.push(state.customFood);
    }
    return foods;
}

document.getElementById("food-continue").addEventListener("click", () => {
    const displayedFoods = selectedFoodsForDisplay();

    if (state.foods.has("Khác") && !state.customFood) {
        document.getElementById("food-error").textContent =
            "eiu ghi món khác dô đyyy nkoa ✍🏻";
        customFoodInput.focus();
        return;
    }

    if (displayedFoods.length === 0) {
        document.getElementById("food-error").textContent =
            "eiu chọn mụt món đyyy, hong lẽ mìn đy ngắm nhau no bụng 🍽️";
        return;
    }

    document.getElementById("ticket-times").textContent = [...state.times].join(", ");
    document.getElementById("ticket-foods").textContent = displayedFoods.join(", ");
    showScreen("ticket");
});

document.getElementById("edit-choices").addEventListener("click", () => {
    showScreen("time");
});

function buildTicketText() {
    const times = [...state.times].join(", ");
    const foods = selectedFoodsForDisplay().join(", ");

    return [
        "🎟️ VÉ HẸN HÒ CỤA DỢ IU 🎟️",
        "📅 Ngày: 7/7",
        `⏰ Buổi: ${times}`,
        `🍽️ Món: ${foods}`,
        "💌 Đi cùng: ank iu cụa eiu 😌",
        "💗 Trạng thái: đã chốt kèo, hong được bùng"
    ].join("\n");
}

function renderMiniTicket() {
    const times = [...state.times].join(", ");
    const foods = selectedFoodsForDisplay().join(", ");

    document.getElementById("mini-ticket").innerHTML = `
        🎟️ <strong>vé hẹn hò đã chốt</strong><br>
        📅 7/7<br>
        ⏰ ${escapeHtml(times)}<br>
        🍽️ ${escapeHtml(foods)}<br>
        💗 ank iu cụa eiu
    `;
}

function escapeHtml(value) {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

document.getElementById("final-submit").addEventListener("click", async (event) => {
    const button = event.currentTarget;
    const submitError = document.getElementById("submit-error");

    button.disabled = true;
    button.textContent = "đang chốt kèo nèee... 💗";
    submitError.textContent = "";

    try {
        const response = await fetch("/api/submit", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                times: [...state.times],
                foods: [...state.foods].filter((food) => food !== "Khác"),
                customFood: state.foods.has("Khác") ? state.customFood : "",
            }),
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
            throw new Error(result.message || "chốt kèo chưa thành công ");
        }

        renderMiniTicket();
        showScreen("final");
        burstHearts(42);
    } catch (error) {
        submitError.textContent = error.message;
        button.disabled = false;
        button.textContent = "chốt kèooooo 💞";
    }
});

document.getElementById("copy-ticket").addEventListener("click", async () => {
    const copyStatus = document.getElementById("copy-status");
    const ticketText = buildTicketText();

    try {
        await navigator.clipboard.writeText(ticketText);
        copyStatus.textContent = "đã sao chép gouuu, gửi ank đyyy 💗";
    } catch {
        copyStatus.textContent = "máy hong cho sao chép tự động, eiu chụp màn hình nkoa ";
    }
});

burstHearts(10);
