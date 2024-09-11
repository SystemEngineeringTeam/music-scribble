"use client";

import { useAtomValue } from "jotai";
import styles from "./index.module.scss";
import {
  barCountAtom,
  octaveRangeAtom,
  beatCountAtom,
  minNoteDurationAtom,
} from "@/stores/settings";
import { CSSProperties, useMemo } from "react";
import { Bar, DiatonicChord, Music, Note } from "@/models";
import Block from "./Block";
import { MAX, MIN } from "@/const";

// 仮の楽譜
const music = new Music({
  bars: [
    new Bar({
      notes: [
        new Note({ scale: "C", octave: 4, start: 0, duration: 4 }),
        new Note({ scale: "D", octave: 4, start: 4, duration: 4 }),
      ],
      chord: new DiatonicChord({
        scale: "C",
        octave: 2,
        start: 0,
        duration: 16,
      }),
    }),
    new Bar({
      notes: [
        new Note({ scale: "C", octave: 5, start: 0, duration: 4 }),
        new Note({ scale: "D", octave: 5, start: 4, duration: 4 }),
      ],
      chord: new DiatonicChord({
        scale: "C",
        octave: 2,
        start: 0,
        duration: 16,
      }),
    }),
    new Bar({
      notes: [
        new Note({ scale: "C", octave: 3, start: 0, duration: 4 }),
        new Note({ scale: "D", octave: 3, start: 4, duration: 4 }),
      ],
      chord: new DiatonicChord({
        scale: "C",
        octave: 2,
        start: 0,
        duration: 16,
      }),
    }),
  ],
});

export default function Blocks() {
  const octaveRange = useAtomValue(octaveRangeAtom); // 表示する音域
  const barCount = useAtomValue(barCountAtom); // 小節数
  const beatCount = useAtomValue(beatCountAtom); // 拍子
  const minNoteDuration = useAtomValue(minNoteDurationAtom); // 最小音符の長さ

  const cols = barCount * beatCount * minNoteDuration;
  const rows = (octaveRange[MAX] - octaveRange[MIN] + 1) * 12;

  const style = useMemo(
    () =>
      ({
        // 1小節あたりのカラム数
        ["--cols-per-bar" as string]: beatCount * minNoteDuration,
        ["--cols" as string]: cols,
        ["--rows" as string]: rows,
      }) satisfies CSSProperties,
    [beatCount, minNoteDuration, cols, rows],
  );

  return (
    <section className={styles.blocks}>
      <div className={styles.innner} style={style}>
        <div className={styles.beat_line_container}>
          {Array.from({ length: barCount * beatCount + 1 }).map((_, i) => (
            // 区切り線(縦線)
            <div
              key={i}
              style={{ ["--c" as string]: minNoteDuration * i + 1 }}
            />
          ))}
        </div>

        <div className={styles.key_line_container}>
          {Array.from({ length: rows }).map((_, i) => (
            // 区切り線(縦線)
            <div key={i} style={{ ["--r" as string]: i + 1 }} />
          ))}
        </div>

        {music.bars.map((bar, i) => (
          // 1小節
          <div key={bar.id} className={styles.bar_container}>
            {bar.notes.map((note) => (
              // 1音
              <Block
                key={note.id}
                note={note}
                octaveRange={octaveRange}
                barIndex={i}
              />
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}