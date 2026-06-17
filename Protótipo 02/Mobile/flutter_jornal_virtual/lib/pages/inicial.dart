import 'package:flutter/material.dart';

import 'pag1.dart';

class HomePage extends StatefulWidget {
  const HomePage({super.key});

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage>
    with SingleTickerProviderStateMixin {
  bool showMenu = false;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF4F1ED),

      body: Stack(
        children: [
          // CONTEÚDO
          AnimatedSlide(
            duration: const Duration(milliseconds: 400),
            curve: Curves.easeOut,
            offset: showMenu ? const Offset(0.7, 0) : Offset.zero,
            child: AnimatedScale(
              duration: const Duration(milliseconds: 400),
              scale: showMenu ? 0.9 : 1,
              child: Container(
                decoration: BoxDecoration(
                  borderRadius: showMenu ? BorderRadius.circular(25) : null,
                ),
                clipBehavior: Clip.hardEdge,
                child: Scaffold(
                  backgroundColor: const Color(0xFFF4F1ED),

                  bottomNavigationBar: Container(
                    height: 70,
                    color: const Color(0xFFD92B68),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceAround,
                      children: const [
                        Icon(
                          Icons.home_outlined,
                          color: Colors.white,
                          size: 35,
                        ),
                        Icon(Icons.menu, color: Colors.white, size: 35),
                        Icon(
                          Icons.person_outline,
                          color: Colors.white,
                          size: 35,
                        ),
                        Icon(
                          Icons.settings_outlined,
                          color: Colors.white,
                          size: 35,
                        ),
                      ],
                    ),
                  ),

                  body: SafeArea(
                    child: SingleChildScrollView(
                      child: Column(
                        children: [
                          // HEADER
                          Container(
                            height: 90,
                            color: const Color(0xFFD92B68),
                            child: Center(
                              child: Image.asset(
                                '/logos/logotrans.png',
                                height: 60,
                                fit: BoxFit.contain,
                              ),
                            ),
                          ),

                          // MENU TOP
                          Container(
                            width: double.infinity,
                            color: const Color(0xFFDCCCB3),
                            padding: const EdgeInsets.symmetric(
                              horizontal: 20,
                              vertical: 12,
                            ),
                            child: GestureDetector(
                              onTap: () {
                                setState(() {
                                  showMenu = !showMenu;
                                });
                              },
                              child: const Row(
                                children: [
                                  Icon(
                                    Icons.menu,
                                    color: Color(0xFFD92B68),
                                    size: 35,
                                  ),
                                  SizedBox(width: 10),
                                  Text(
                                    "menu",
                                    style: TextStyle(
                                      color: Color(0xFFD92B68),
                                      fontFamily: 'Lustria',
                                      fontSize: 22,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ),

                          const SizedBox(height: 20),

                          // ANIMAÇÃO
                          AnimatedCard(delay: 200, child: capaCard()),

                          const SizedBox(height: 25),

                          sectionTitle("Acontece na Escola"),

                          Row(
                            children: [
                              Expanded(
                                child: AnimatedCard(
                                  delay: 400,
                                  child: noticiaCard(),
                                ),
                              ),
                              Expanded(
                                child: AnimatedCard(
                                  delay: 600,
                                  child: noticiaCard(),
                                ),
                              ),
                            ],
                          ),

                          const SizedBox(height: 20),

                          sectionTitle("Destaque Multimídia"),

                          Row(
                            children: [
                              Expanded(
                                child: AnimatedCard(
                                  delay: 800,
                                  child: videoCard(),
                                ),
                              ),
                              Expanded(
                                child: AnimatedCard(
                                  delay: 1000,
                                  child: videoCard(),
                                ),
                              ),
                            ],
                          ),

                          const SizedBox(height: 30),
                        ],
                      ),
                    ),
                  ),
                ),
              ),
            ),
          ),

          // MENU LATERAL
          AnimatedPositioned(
            duration: const Duration(milliseconds: 400),
            left: showMenu ? 0 : -250,
            top: 0,
            bottom: 0,
            child: Container(
              width: 250,
              color: const Color(0xFFF4F1ED),
              padding: const EdgeInsets.only(top: 100),
              child: Column(
                children: [
                  menuItem(Icons.description, "Noticias"),
                  menuItem(Icons.computer, "Opinião"),
                  menuItem(Icons.calendar_month, "Eventos"),
                  menuItem(Icons.folder, "Mural"),
                  menuItem(Icons.book, "Trabalhos"),
                  menuItem(Icons.podcasts, "Podcast"),
                  menuItem(Icons.message, "Mensagens"),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget sectionTitle(String text) {
    return Padding(
      padding: const EdgeInsets.only(left: 20, bottom: 15),
      child: Align(
        alignment: Alignment.centerLeft,
        child: Text(
          text,
          style: const TextStyle(
            fontSize: 34,
            color: Color(0xFFD92B68),
            fontWeight: FontWeight.bold,
          ),
        ),
      ),
    );
  }

  Widget menuItem(IconData icon, String title) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 18, horizontal: 20),
      child: Row(
        children: [
          Icon(icon, size: 40, color: const Color(0xFFDCCCB3)),
          const SizedBox(width: 15),
          Text(
            title,
            style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
          ),
        ],
      ),
    );
  }

  Widget capaCard() {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 20),
      child: Stack(
        clipBehavior: Clip.none,
        children: [
          // BOLOTA
          Positioned(
            right: -20,
            top: -20,
            child: Container(
              width: 180,
              height: 180,
              decoration: const BoxDecoration(
                color: Color(0xFFDCCCB3),
                shape: BoxShape.circle,
              ),
            ),
          ),

          // CARD
          Container(
            padding: const EdgeInsets.all(15),
            decoration: BoxDecoration(
              color: const Color(0xFFD92B68),
              borderRadius: BorderRadius.circular(25),
              boxShadow: [
                BoxShadow(
                  blurRadius: 8,
                  color: Colors.black.withValues(alpha: 0.2),
                  offset: const Offset(0, 4),
                ),
              ],
            ),

            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // LINHA COM TÍTULO + IMAGEM
                Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // TÍTULO
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: const [
                          Text(
                            "Noticia de Capa:",
                            style: TextStyle(
                              fontFamily: 'CrimsonPro',
                              color: Colors.black,
                              fontSize: 24,
                              fontWeight: FontWeight.w700,
                            ),
                          ),

                          SizedBox(height: 10),

                          Text(
                            "SESI do Ceará conquista segundo lugar em competição internacional",
                            style: TextStyle(
                              fontFamily: 'CreteRound',
                              fontSize: 17,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ],
                      ),
                    ),

                    const SizedBox(width: 15),

                    // IMAGEM
                    ClipRRect(
                      borderRadius: BorderRadius.circular(20),
                      child: Image.asset(
                        "/imgs/equiperobot.jpg",
                        width: 130,
                        height: 180,
                        fit: BoxFit.cover,
                      ),
                    ),
                  ],
                ),

                const SizedBox(height: 15),

                // DESCRIÇÃO EMBAIXO
                const Text(
                  "Alunos da Escola SESI SENAI Sobral conquistaram o segundo lugar na competição internacional de vídeos, promovida pela WIPO destacando a relevância da propriedade intelectual.",
                  style: TextStyle(fontSize: 13),
                ),

                const SizedBox(height: 15),
                ElevatedButton(
                  onPressed: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(builder: (context) => const Pagina1()),
                    );
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFFDCCCB3),
                    foregroundColor: Colors.black,
                  ),
                  child: const Text(
                    "LER MAIS",
                    style: TextStyle(
                      fontFamily: 'CreteRound',
                      color: Color.fromARGB(255, 114, 24, 49),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget noticiaCard() {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 10),
      decoration: BoxDecoration(
        color: const Color(0xFFDCCCB3),
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(
            blurRadius: 6,
            color: Colors.black,
            offset: const Offset(0, 3),
          ),
        ],
      ),
      child: Column(
        children: [
          Container(
            height: 140,
            decoration: BoxDecoration(
              color: Colors.grey.shade400,
              borderRadius: const BorderRadius.vertical(
                top: Radius.circular(20),
              ),
            ),
          ),
          Padding(
            padding: const EdgeInsets.all(12),
            child: Column(
              children: [
                const Text(
                  "Feira de Ciências 2024",
                  style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 12),
                ElevatedButton(
                  onPressed: () {},
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFFD92B68),
                  ),
                  child: const Text(
                    "LER MAIS",
                    style: TextStyle(color: Colors.white),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget videoCard() {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 10),
      height: 180,
      decoration: BoxDecoration(
        color: Colors.grey.shade400,
        borderRadius: BorderRadius.circular(20),
      ),
      child: const Center(
        child: CircleAvatar(
          radius: 28,
          backgroundColor: Colors.white,
          child: Icon(Icons.play_arrow, color: Color(0xFFD92B68), size: 35),
        ),
      ),
    );
  }
}

// ANIMAÇÃO DE BAIXO PRA CIMA
class AnimatedCard extends StatefulWidget {
  final Widget child;
  final int delay;

  const AnimatedCard({super.key, required this.child, required this.delay});

  @override
  State<AnimatedCard> createState() => _AnimatedCardState();
}

class _AnimatedCardState extends State<AnimatedCard> {
  bool visible = false;

  @override
  void initState() {
    super.initState();

    Future.delayed(Duration(milliseconds: widget.delay), () {
      if (mounted) {
        setState(() {
          visible = true;
        });
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedOpacity(
      duration: const Duration(milliseconds: 500),
      opacity: visible ? 1 : 0,
      child: AnimatedSlide(
        duration: const Duration(milliseconds: 500),
        offset: visible ? Offset.zero : const Offset(0, 0.3),
        curve: Curves.easeOut,
        child: widget.child,
      ),
    );
  }
}
