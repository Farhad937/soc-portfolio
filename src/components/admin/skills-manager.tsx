"use client";

import { useState, useTransition } from "react";
import { Plus, X, ArrowUp, ArrowDown, Trash2 } from "lucide-react";
import type { AdminSkillGroupRow } from "@/lib/admin-content";
import {
  createSkillGroup,
  renameSkillGroup,
  deleteSkillGroup,
  reorderSkillGroup,
  createSkill,
  updateSkillName,
  moveSkillToGroup,
  deleteSkill,
  reorderSkill,
} from "@/lib/admin-content/skills-mutations";

export default function SkillsManager({ groups }: { groups: AdminSkillGroupRow[] }) {
  const [isPending, startTransition] = useTransition();
  const [newCategory, setNewCategory] = useState("");

  function handleAddCategory() {
    const value = newCategory;
    if (!value.trim()) return;
    setNewCategory("");
    startTransition(() => createSkillGroup(value));
  }

  return (
    <div className="space-y-4">
      {groups.map((group, i) => (
        <SkillGroupCard
          key={group.id}
          group={group}
          allGroups={groups}
          isFirst={i === 0}
          isLast={i === groups.length - 1}
        />
      ))}

      <div className="card flex items-center gap-2 p-4">
        <input
          type="text"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAddCategory()}
          placeholder="New category name..."
          className="flex-1 rounded-md border border-border-strong bg-bg-surface px-3 py-2 text-sm text-text placeholder:text-text-faint focus:border-accent"
        />
        <button
          disabled={isPending || !newCategory.trim()}
          onClick={handleAddCategory}
          className="btn-secondary text-sm disabled:opacity-40"
        >
          <Plus className="h-4 w-4" /> Add Category
        </button>
      </div>
    </div>
  );
}

function SkillGroupCard({
  group,
  allGroups,
  isFirst,
  isLast,
}: {
  group: AdminSkillGroupRow;
  allGroups: AdminSkillGroupRow[];
  isFirst: boolean;
  isLast: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const [categoryName, setCategoryName] = useState(group.category);
  const [newSkill, setNewSkill] = useState("");

  function handleRenameBlur() {
    if (categoryName.trim() && categoryName.trim() !== group.category) {
      startTransition(() => renameSkillGroup(group.id, categoryName));
    } else {
      setCategoryName(group.category); // revert if blank
    }
  }

  function handleDeleteGroup() {
    const skillCount = group.skills.length;
    const warning =
      skillCount > 0
        ? `Delete "${group.category}"? This will also permanently delete all ${skillCount} skill(s) in it.`
        : `Delete "${group.category}"?`;
    if (!confirm(warning)) return;
    startTransition(() => deleteSkillGroup(group.id));
  }

  function handleAddSkill() {
    const value = newSkill;
    if (!value.trim()) return;
    setNewSkill("");
    startTransition(() => createSkill(group.id, value));
  }

  return (
    <div className="card p-5">
      <div className="mb-4 flex items-center gap-2">
        <div className="flex flex-col">
          <button
            disabled={isPending || isFirst}
            onClick={() => startTransition(() => reorderSkillGroup(group.id, "up"))}
            className="text-text-faint hover:text-text disabled:opacity-30"
            title="Move category up"
          >
            <ArrowUp className="h-3 w-3" />
          </button>
          <button
            disabled={isPending || isLast}
            onClick={() => startTransition(() => reorderSkillGroup(group.id, "down"))}
            className="text-text-faint hover:text-text disabled:opacity-30"
            title="Move category down"
          >
            <ArrowDown className="h-3 w-3" />
          </button>
        </div>

        <input
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          onBlur={handleRenameBlur}
          className="flex-1 rounded-md border border-transparent bg-transparent px-2 py-1 font-mono text-xs uppercase tracking-wide text-accent hover:border-border-strong focus:border-accent focus:bg-bg-surface"
        />

        <button
          disabled={isPending}
          onClick={handleDeleteGroup}
          className="rounded p-1.5 text-text-faint hover:bg-danger/10 hover:text-danger disabled:opacity-40"
          title="Delete category"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="space-y-1.5">
        {group.skills.map((skill, i) => (
          <SkillRow
            key={skill.id}
            skill={skill}
            groupId={group.id}
            allGroups={allGroups}
            isFirst={i === 0}
            isLast={i === group.skills.length - 1}
          />
        ))}
      </div>

      <div className="mt-3 flex items-center gap-2">
        <input
          type="text"
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAddSkill()}
          placeholder="Add a skill..."
          className="flex-1 rounded-md border border-border-strong bg-bg-surface px-3 py-1.5 text-sm text-text placeholder:text-text-faint focus:border-accent"
        />
        <button
          disabled={isPending || !newSkill.trim()}
          onClick={handleAddSkill}
          className="text-text-faint hover:text-accent disabled:opacity-40"
          title="Add skill"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function SkillRow({
  skill,
  groupId,
  allGroups,
  isFirst,
  isLast,
}: {
  skill: { id: string; name: string; order_index: number };
  groupId: string;
  allGroups: AdminSkillGroupRow[];
  isFirst: boolean;
  isLast: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const [name, setName] = useState(skill.name);

  function handleNameBlur() {
    if (name.trim() && name.trim() !== skill.name) {
      startTransition(() => updateSkillName(skill.id, name));
    } else {
      setName(skill.name);
    }
  }

  function handleDelete() {
    if (!confirm(`Delete "${skill.name}"?`)) return;
    startTransition(() => deleteSkill(skill.id));
  }

  return (
    <div className="flex items-center gap-1.5 rounded-md border border-border-strong bg-bg-raised px-2 py-1">
      <div className="flex flex-col">
        <button
          disabled={isPending || isFirst}
          onClick={() => startTransition(() => reorderSkill(skill.id, groupId, "up"))}
          className="text-text-faint hover:text-text disabled:opacity-30"
          title="Move up"
        >
          <ArrowUp className="h-2.5 w-2.5" />
        </button>
        <button
          disabled={isPending || isLast}
          onClick={() => startTransition(() => reorderSkill(skill.id, groupId, "down"))}
          className="text-text-faint hover:text-text disabled:opacity-30"
          title="Move down"
        >
          <ArrowDown className="h-2.5 w-2.5" />
        </button>
      </div>

      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        onBlur={handleNameBlur}
        className="flex-1 rounded border border-transparent bg-transparent px-1.5 py-0.5 text-sm text-text hover:border-border-strong focus:border-accent focus:bg-bg-surface"
      />

      {allGroups.length > 1 && (
        <select
          value={groupId}
          onChange={(e) => startTransition(() => moveSkillToGroup(skill.id, e.target.value))}
          disabled={isPending}
          className="rounded border border-border-strong bg-bg-surface px-1.5 py-0.5 font-mono text-[10px] text-text-faint"
          title="Move to category"
        >
          {allGroups.map((g) => (
            <option key={g.id} value={g.id}>
              {g.category}
            </option>
          ))}
        </select>
      )}

      <button
        disabled={isPending}
        onClick={handleDelete}
        className="rounded p-1 text-text-faint hover:bg-danger/10 hover:text-danger disabled:opacity-40"
        title="Delete skill"
      >
        <X className="h-3 w-3" />
      </button>
    </div>
  );
}
