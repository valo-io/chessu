"use client";

import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import { useContext, useState } from "react";

import { SessionContext } from "@/context/session";
import { createGame } from "@/lib/game";

const TIME_CONTROLS = [
  "1|0", "1|1", "2|1", "3|0", "3|2", "5|0", "10|0", "15|10", "30|0"
];

export default function CreateGame() {
  const session = useContext(SessionContext);
  const [buttonLoading, setButtonLoading] = useState(false);
  const router = useRouter();

  async function submitCreateGame(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!session?.user?.id) return;
    setButtonLoading(true);

    const target = e.target as HTMLFormElement;
    const unlisted = target.elements.namedItem("createUnlisted") as HTMLInputElement;
    const startingSide = (target.elements.namedItem("createStartingSide") as HTMLSelectElement)
      .value;
    const timeControl = (target.elements.namedItem("timeControl") as HTMLSelectElement).value;

    const game = await createGame(startingSide, unlisted.checked, timeControl);

    if (game) {
      router.push(`/${game.code}`);
    } else {
      setButtonLoading(false);
      // TODO: Show error message
    }
  }

  return (
    <form className="form-control" onSubmit={submitCreateGame}>
      <label className="label cursor-pointer">
        <span className="label-text">Unlisted/invite-only</span>
        <input type="checkbox" className="checkbox" name="createUnlisted" id="createUnlisted" />
      </label>
      <label className="label" htmlFor="createStartingSide">
        <span className="label-text">Select your side</span>
      </label>
      <div className="input-group">
        <select className="select select-bordered" name="createStartingSide" id="createStartingSide">
          <option value="random">Random</option>
          <option value="white">White</option>
          <option value="black">Black</option>
        </select>
      </div>
      <label className="label mt-2" htmlFor="timeControl">
        <span className="label-text">Time control (minutes | increment seconds)</span>
      </label>
      <select className="select select-bordered" name="timeControl" id="timeControl">
        {TIME_CONTROLS.map(tc => (
          <option key={tc} value={tc}>{tc}</option>
        ))}
      </select>
      <button
        className={"btn mt-4" + (buttonLoading ? " loading" : "") + (!session?.user?.id ? " btn-disabled" : "")}
        type="submit"
      >
        Create
      </button>
    </form>
  );
}
