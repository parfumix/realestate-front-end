<template>
    <main class="flex flex-row space-x-2 ml-20 p-6">
        <div class="w-1/2">
            <form class="overflow-auto h-screen">
                <div class="space-y-12">
                    <div class="border-b border-gray-900/10 pb-12">
                        <h2 class="text-base font-semibold text-gray-900">Modifică oferta</h2>
                        <p class="mt-1 text-sm text-gray-600">Urmează paşii, e mai simplu ca niciodată.</p>

                        <!-- Property Type -->
                        <div class="mt-10">
                            <label class="block text-sm font-medium text-gray-900">Tip proprietate</label>
                            <div class="mt-2 flex gap-4">
                                <button type="button"
                                    class="px-4 py-2 bg-white rounded-md shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline focus:ring-2 focus:ring-indigo-600">Apartament</button>
                                <button type="button"
                                    class="px-4 py-2 bg-white rounded-md shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline focus:ring-2 focus:ring-indigo-600">Casă</button>
                                <button type="button"
                                    class="px-4 py-2 bg-white rounded-md shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline focus:ring-2 focus:ring-indigo-600">Teren</button>
                                <button type="button"
                                    class="px-4 py-2 bg-white rounded-md shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline focus:ring-2 focus:ring-indigo-600">Comercial</button>
                            </div>
                        </div>

                        <!-- Transaction Type -->
                        <div class="mt-10">
                            <label class="block text-sm font-medium text-gray-900">Tip tranzacție</label>
                            <div class="mt-2 flex gap-4">
                                <button type="button"
                                    class="px-4 py-2 bg-white rounded-md shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline focus:ring-2 focus:ring-indigo-600">De
                                    vânzare</button>
                                <button type="button"
                                    class="px-4 py-2 bg-white rounded-md shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline focus:ring-2 focus:ring-indigo-600">De
                                    închiriat</button>
                            </div>
                        </div>

                        <!-- Title -->
                        <div class="mt-10">
                            <label for="title" class="block text-sm font-medium text-gray-900">Titlu anunț</label>
                            <div class="mt-2">
                                <input type="text" id="title"
                                    class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 focus:outline focus:ring-2 focus:ring-indigo-600"
                                    placeholder="Apartament de vânzare 2 camere acum" />
                            </div>
                            <p class="mt-2 text-sm text-gray-500">46 caractere rămase.</p>
                        </div>

                        <!-- Image Upload -->
                        <div class="mt-10">
                            <label for="images" class="block text-sm font-medium text-gray-900">Imagini</label>
                            <div
                                class="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                                <div class="text-center">
                                    <p class="text-sm text-gray-600">Trage imaginea aici sau încarcă una de pe
                                        dispozitivul
                                        tău.</p>
                                    <input id="images" name="images" type="file" class="sr-only" />
                                    <p class="text-xs text-gray-500">PNG, JPG, GIF până la 10MB</p>
                                </div>
                            </div>
                        </div>

                        <!-- Rooms and Details -->
                        <div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2">
                            <div>
                                <label for="rooms" class="block text-sm font-medium text-gray-900">Nr.
                                    camere</label>
                                <select id="rooms"
                                    class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 focus:outline focus:ring-2 focus:ring-indigo-600">
                                    <option>1</option>
                                    <option>2</option>
                                    <option>3</option>
                                    <option>4</option>
                                    <option>5+</option>
                                </select>
                            </div>

                            <div>
                                <label for="compartimentare"
                                    class="block text-sm font-medium text-gray-900">Compartimentare</label>
                                <select id="compartimentare"
                                    class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 focus:outline focus:ring-2 focus:ring-indigo-600">
                                    <option>Alege</option>
                                </select>
                            </div>

                            <div>
                                <label for="floor" class="block text-sm font-medium text-gray-900">Etaj</label>
                                <input id="floor" type="text"
                                    class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 focus:outline focus:ring-2 focus:ring-indigo-600"
                                    placeholder="Etaj 7" />
                            </div>

                            <div>
                                <label for="surface" class="block text-sm font-medium text-gray-900">Suprafață
                                    utilă</label>
                                <input id="surface" type="text"
                                    class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 focus:outline focus:ring-2 focus:ring-indigo-600"
                                    placeholder="mp" />
                            </div>
                        </div>

                        <!-- Contact Details -->
                        <div class="mt-10">
                            <label for="contact" class="block text-sm font-medium text-gray-900">Persoana de
                                contact</label>
                            <div class="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                                <input id="email" type="email" placeholder="Email"
                                    class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 focus:outline focus:ring-2 focus:ring-indigo-600" />
                                <input id="phone" type="text" placeholder="Telefon"
                                    class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 focus:outline focus:ring-2 focus:ring-indigo-600" />
                            </div>
                        </div>
                    </div>

                    <div class="mt-6 flex justify-end gap-4">
                        <button type="button" class="text-sm font-medium text-gray-900">Anulează</button>
                        <button type="submit" class="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 focus:outline focus:ring-2 focus:ring-indigo-600">Salvează</button>
                    </div>
                </div>
            </form>
        </div>

        <div class="w-1/2">
            <AdMap class="w-full h-full" />
        </div>
    </main>
</template>