<script lang="ts">
    import type { PageData } from "./$types";
    import { onMount } from "svelte";
    import { supabase } from "$lib/db";
    import CreateNote from "$lib/CreateNote.svelte";
    import EditNote from "$lib/EditNote.svelte";

    export let data: PageData;
    let editNote: { id: number; title: string; content: string } | null = null;
    let createNewNote = false;

    const fetchNotes = async () => {
        const { data: _data, error } = await supabase
            .from("notes")
            .select()
            .order("id", { ascending: false });

        if (error) throw error;

        data.notes = _data;
    };

    onMount(() => {
        supabase
            .channel("any")
            .on(
                "postgres_changes",
                { event: "*", schema: "public", table: "notes" },
                (payload) => {
                    fetchNotes();
                }
            )
            .subscribe();
    });

    const deleteNote = async (e: MouseEvent, id: number) => {
        e.preventDefault();

        const confirmed = confirm(
            "Are you sure you want to delete this note? This is permanent and cannot be undone"
        );

        if (confirmed === false) return;

        const { error } = await supabase.from("notes").delete().eq("id", id);

        if (error) throw error;
    };

    const handleModalClose = () => {
        createNewNote = false;
        editNote = null;
    };

    $: {
        if (editNote) createNewNote = false;
    }
</script>

<section>
    <h2>Create new note</h2>

    <button type="button" on:click={() => (createNewNote = true)}>
        Create new note
    </button>
</section>

{#if createNewNote}
    <CreateNote on:close={handleModalClose} />
{/if}

{#if editNote}
    <EditNote note={editNote} on:close={handleModalClose} />
{/if}

<section>
    <h2>Notes</h2>

    {#if data.notes.length < 1}
        <p>
            No notes yet...
            <a
                href="javascript:void(0)"
                on:click={() => (createNewNote = true)}
            >
                Create
            </a>
        </p>
    {:else}
        {#each data.notes as note (note.id)}
            <article>
                <header>
                    <p>{note.title}</p>
                </header>

                <main>
                    <p>{note.content}</p>
                </main>

                <footer>
                    <a
                        href="javascript:void(0)"
                        role="button"
                        class="secondary outline"
                        on:click={(event) => deleteNote(event, note.id)}
                    >
                        Delete
                    </a>

                    <a
                        href="javascript:void(0)"
                        role="button"
                        on:click={() => (editNote = note)}
                    >
                        Edit
                    </a>
                </footer>
            </article>
        {/each}
    {/if}
</section>

<style>
    section > h2 {
        margin-bottom: 1rem;
    }

    section > article:first-of-type {
        margin-top: 0;
    }

    article footer {
        display: flex;
        justify-content: end;
        align-items: center;
    }

    article footer > * + :not([hidden]) {
        margin-left: 1rem;
    }
</style>
