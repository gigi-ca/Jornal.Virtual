import 'package:flutter/material.dart';
import 'package:flutter_jornal_virtual/pages/pagina3.dart';
import 'package:flutter_jornal_virtual/pages/perfil.dart';
import 'package:flutter_jornal_virtual/pages/config.dart';

import 'pag1.dart';
import 'pagina_dois.dart';

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
                    height: 65,
                    color: const Color(0xFFD92B68),
                    child: Row(
                      children: [
                        Expanded(
                          child: Center(
                            child: Container(
                              width: 50,
                              height: 50,
                              decoration: const BoxDecoration(
                                color: Colors.white,
                                shape: BoxShape.circle,
                              ),
                              child: IconButton(
                                icon: const Icon(
                                  Icons.home,
                                  color: Colors.black,
                                  size: 30,
                                ),
                                onPressed: () {
                                  setState(() {});
                                  ScaffoldMessenger.of(context).showSnackBar(
                                    const SnackBar(
                                      content: Text(
                                        "Página Inicial atualizada",
                                      ),
                                      duration: Duration(milliseconds: 700),
                                    ),
                                  );
                                },
                              ),
                            ),
                          ),
                        ),
                        const Expanded(
                          child: IconButton(
                            icon: Icon(
                              Icons.menu,
                              color: Colors.white,
                              size: 30,
                            ),
                            onPressed: null,
                          ),
                        ),
                        Expanded(
                          child: IconButton(
                            icon: const Icon(
                              Icons.account_circle,
                              color: Colors.white,
                              size: 32,
                            ),
                            onPressed: () {
                              Navigator.push(
                                context,
                                MaterialPageRoute(
                                  builder: (_) => const PerfilPage(),
                                ),
                              );
                            },
                          ),
                        ),
                        Expanded(
                          child: IconButton(
                            icon: const Icon(
                              Icons.settings,
                              color: Colors.white,
                              size: 30,
                            ),
                            onPressed: () {
                              Navigator.push(
                                context,
                                MaterialPageRoute(
                                  builder: (_) => const ConfigPage(),
                                ),
                              );
                            },
                          ),
                        ),
                      ],
                    ),
                  ),

                  body: SafeArea(
                    child: SingleChildScrollView(
                      child: Column(
                        children: [
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

                          AnimatedCard(delay: 200, child: capaCard()),

                          const SizedBox(height: 25),

                          sectionTitle("Acontece na Escola"),

                          Row(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Expanded(
                                child: AnimatedCard(
                                  delay: 400,
                                  child: noticiaCard(
                                    titulo:
                                        "Feira de Ciências 2024: Sustentabilidade na comunidade.",
                                    imagePath: "/imgs/feiradeciencias.jpg",
                                    backgroundColor: const Color(0xFFD92B68),
                                    buttonColor: const Color(0xFFDCCCB3),
                                    textColor: const Color(0xFF721831),
                                    buttonTextColor: const Color(0xFF721831),
                                    onTap: () {
                                      Navigator.push(
                                        context,
                                        MaterialPageRoute(
                                          builder: (context) => const Pagina3(),
                                        ),
                                      );
                                    },
                                  ),
                                ),
                              ),

                              Expanded(
                                child: AnimatedCard(
                                  delay: 600,
                                  child: noticiaCard(
                                    titulo:
                                        "Reconhecimento de iniciativas presentes no III Congresso...",
                                    imagePath: "/imgs/horta.jpeg",
                                    backgroundColor: const Color(0xFFDCCCB3),
                                    buttonColor: const Color(0xFFD92B68),
                                    textColor: const Color(0xFF721831),
                                    buttonTextColor: Colors.white,
                                    onTap: () {
                                      Navigator.push(
                                        context,
                                        MaterialPageRoute(
                                          builder: (context) => const Pagina3(),
                                        ),
                                      );
                                    },
                                  ),
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
                  menuItem(context, Icons.description, "Noticias"),
                  menuItem(context, Icons.computer, "Opinião"),
                  menuItem(context, Icons.calendar_month, "Eventos"),
                  menuItem(context, Icons.folder, "Mural"),
                  menuItem(context, Icons.book, "Trabalhos"),
                  menuItem(context, Icons.podcasts, "Podcast"),
                  menuItem(context, Icons.message, "Feed"),
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

  Widget menuItem(BuildContext context, IconData icon, String title) {
    return InkWell(
      onTap: () {
        if (title == "Mural") {
          Navigator.push(
            context,
            MaterialPageRoute(builder: (_) => const PaginaDois()),
          );
        }
      },
      child: Padding(
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
      ),
    );
  }

  Widget capaCard() {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 20),
      child: Stack(
        clipBehavior: Clip.none,
        children: [
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
                Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
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
                const Text(
                  "Alunos da Escola SESI SENAI Sobral conquistaram o second lugar na competição internacional de vídeos, promovida pela WIPO destacando a relevância da propriedade intelectual.",
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

  Widget noticiaCard({
    required String titulo,
    required String imagePath,
    required Color backgroundColor,
    required Color buttonColor,
    required Color textColor,
    required Color buttonTextColor,
    required VoidCallback onTap,
  }) {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 10),
      decoration: BoxDecoration(
        color: backgroundColor,
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(
            blurRadius: 6,
            color: Colors.black.withValues(alpha: 0.15),
            offset: const Offset(0, 3),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          ClipRRect(
            borderRadius: const BorderRadius.vertical(top: Radius.circular(20)),
            child: Image.asset(
              imagePath,
              height: 140,
              width: double.infinity,
              fit: BoxFit.cover,
              errorBuilder: (context, error, stackTrace) {
                return Container(
                  height: 140,
                  color: Colors.grey.shade400,
                  child: const Icon(Icons.image, size: 40),
                );
              },
            ),
          ),
          Padding(
            padding: const EdgeInsets.all(12),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  titulo,
                  maxLines: 3,
                  overflow: TextOverflow.ellipsis,
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                    color: textColor,
                  ),
                ),
                const SizedBox(height: 12),
                ElevatedButton(
                  onPressed: onTap,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: buttonColor,
                    elevation: 0,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(10),
                    ),
                  ),
                  child: Text(
                    "LER MAIS",
                    style: TextStyle(
                      color: buttonTextColor,
                      fontWeight: FontWeight.bold,
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