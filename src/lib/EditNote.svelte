<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import { supabase } from "$lib/db";

    export let note: { id: number; title: string; content: string };

    const dispatch = createEventDispatcher();

    const saveNote = async (event: SubmitEvent) => {
        event.preventDefault();

        const { error } = await supabase
            .from("notes")
            .update({ title: note.title, content: note.content })
            .eq("id", note.id);

        if (error) throw error;

        emitClose();
    };

    const emitClose = () => {
        dispatch("close");
    };
</script>

<dialog open>
    <article>
        <header>
            <a
                href="javascript:void(0)"
                on:click={emitClose}
                aria-label="Close"
                class="close"
            />

            <p>{note.title}</p>
        </header>

        <main>
            <form id="edit-note" on:submit={saveNote}>
                <label for="title">
                    Title *
                    <input
                        bind:value={note.title}
                        type="text"
                        name="title"
                        id="title"
                        placeholder="Title..."
                        required={true}
                    />
                </label>

                <label for="content">
                    Content *
                    <input
                        bind:value={note.content}
                        type="text"
                        name="content"
                        id="content"
                        placeholder="Content..."
                        required={true}
                    />
                </label>
            </form>
        </main>

        <footer>
            <div class="grid">
                <a
                    href="javascript:void(0)"
                    role="button"
                    on:click={emitClose}
                    class="secondary outline"
                >
                    Cancel
                </a>

                <input
                    type="submit"
                    role="button"
                    form="edit-note"
                    value="Save"
                />
            </div>
        </footer>
    </article>
</dialog>
