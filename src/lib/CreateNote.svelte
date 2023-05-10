<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import { supabase } from "$lib/db";

    let title = "";
    let content = "";

    const dispatch = createEventDispatcher();

    const saveNote = async (event: SubmitEvent) => {
        event.preventDefault();

        const { error } = await supabase
            .from("notes")
            .insert({ title, content });

        if (error)
            throw error

        emitClose();
    };

    const emitClose = () => {
        dispatch("close");
    };

    const handleKeyPress = ({ key }: KeyboardEvent) => {
        if (key === "Escape") return emitClose();
    };
</script>

<svelte:body on:keyup={handleKeyPress} />

<dialog open>
    <article>
        <header>
            <a
                href="javascript:void(0)"
                on:click={emitClose}
                aria-label="Close"
                class="close"
            />

            <p>Create new note</p>
        </header>

        <main>
            <form id="create-note" on:submit={saveNote}>
                <label for="title">
                    Title *
                    <input
                        bind:value={title}
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
                        bind:value={content}
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
                    href="#"
                    role="button"
                    on:click={emitClose}
                    class="secondary outline"
                >
                    Cancel
                </a>

                <input
                    type="submit"
                    role="button"
                    form="create-note"
                    value="Save"
                />
            </div>
        </footer>
    </article>
</dialog>
